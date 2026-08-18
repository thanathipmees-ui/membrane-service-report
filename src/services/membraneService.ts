import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company, ROSystem, MembraneData } from '../types';
import { initialMembranes } from '../data/initialMembranes';
import { defaultHeaderConfig } from '../utils/calculations';

const COMPANIES_COL = 'companies';
const RO_SYSTEMS_COL = 'ro_systems';
const MEMBRANES_COL = 'membranes';

export const DEFAULT_COMPANY: Company = {
  id: 'lion-corp',
  name: 'Lion Corporation (Thailand) Limited',
  createdAt: new Date().toISOString()
};

export const DEFAULT_RO_SYSTEMS: ROSystem[] = [
  {
    id: 'lion-ro-1',
    companyId: 'lion-corp',
    name: 'RO1 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO1 Pass 1',
      reportTitle: 'RO1 Pass 1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-2',
    companyId: 'lion-corp',
    name: 'RO2 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO2 Pass 1',
      reportTitle: 'RO2 Pass 1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-3',
    companyId: 'lion-corp',
    name: 'RO3 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO3 Pass 1',
      reportTitle: 'RO3 Pass 1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-4',
    companyId: 'lion-corp',
    name: 'RO4 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO4 Pass 1',
      reportTitle: 'RO4 Pass 1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-5',
    companyId: 'lion-corp',
    name: 'RO5 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO5 Pass 1',
      reportTitle: 'RO5 Pass 1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  }
];

/**
 * Check if the RO is Lion RO4 Pass 1
 */
export function isLionRO4(companyId?: string, roId?: string, roName?: string): boolean {
  const isLion = !companyId || companyId === 'lion-corp' || companyId.toLowerCase().includes('lion');
  const isRO4 =
    !roId ||
    roId === 'lion-ro-4' ||
    roId.toLowerCase().includes('ro-4') ||
    roId.toLowerCase().includes('ro4') ||
    (roName && (roName.toLowerCase().includes('ro4') || roName.toLowerCase().includes('ro 4')));
  return isLion && isRO4;
}

/**
 * Generates the full 30 initial membranes for RO4 Pass 1
 */
export function getDefaultLionRO4Membranes(targetRoId = 'lion-ro-4', targetCompanyId = 'lion-corp'): MembraneData[] {
  return initialMembranes.map((m) => ({
    ...m,
    id: `${targetCompanyId}_${targetRoId}_${m.membraneNo}`,
    companyId: targetCompanyId,
    roId: targetRoId,
    headerConfig: m.headerConfig || {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO4 Pass 1',
      reportTitle: 'RO4 Pass 1 Membrane Cleaning Report'
    }
  }));
}

/**
 * Sanitizes object values to ensure no `undefined` fields are sent to Firestore.
 */
function sanitizeForFirestore<T>(data: T): T {
  if (data === undefined) {
    return null as unknown as T;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeForFirestore(item)) as unknown as T;
  }
  const cleanObj: Record<string, any> = {};
  for (const [key, val] of Object.entries(data as Record<string, any>)) {
    if (val !== undefined) {
      cleanObj[key] = sanitizeForFirestore(val);
    } else {
      cleanObj[key] = null;
    }
  }
  return cleanObj as T;
}

const STORAGE_COMPANIES_KEY = 'ro_membrane_app_companies_v1';
const STORAGE_RO_SYSTEMS_KEY = 'ro_membrane_app_ro_systems_v1';
const STORAGE_MEMBRANES_KEY = 'ro_membrane_app_membranes_v1';

// In-memory cache to prevent duplicate Firestore calls during the session
const sessionFetchedROs = new Set<string>();

export function getCachedCompanies(): Company[] {
  try {
    const raw = localStorage.getItem(STORAGE_COMPANIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to read cached companies:', e);
  }
  setCachedCompanies([DEFAULT_COMPANY]);
  return [DEFAULT_COMPANY];
}

export function setCachedCompanies(companies: Company[]): void {
  try {
    localStorage.setItem(STORAGE_COMPANIES_KEY, JSON.stringify(companies));
  } catch (e) {
    console.warn('Failed to write cached companies:', e);
  }
}

export function getCachedROSystems(companyId?: string): ROSystem[] {
  try {
    const raw = localStorage.getItem(STORAGE_RO_SYSTEMS_KEY);
    if (raw) {
      const all: ROSystem[] = JSON.parse(raw);
      if (Array.isArray(all) && all.length > 0) {
        if (companyId) {
          const filtered = all.filter((r) => r.companyId === companyId);
          if (filtered.length > 0) return filtered;
        } else {
          return all;
        }
      }
    }
  } catch (e) {
    console.warn('Failed to read cached ro systems:', e);
  }
  setCachedROSystems(DEFAULT_RO_SYSTEMS);
  if (companyId) return DEFAULT_RO_SYSTEMS.filter((r) => r.companyId === companyId);
  return DEFAULT_RO_SYSTEMS;
}

export function setCachedROSystems(roSystems: ROSystem[]): void {
  try {
    localStorage.setItem(STORAGE_RO_SYSTEMS_KEY, JSON.stringify(roSystems));
  } catch (e) {
    console.warn('Failed to write cached ro systems:', e);
  }
}

export function getCachedMembranes(companyId?: string, roId?: string, roName?: string): MembraneData[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEMBRANES_KEY);
    if (raw) {
      const all: MembraneData[] = JSON.parse(raw);
      if (Array.isArray(all) && all.length > 0) {
        if (companyId && roId) {
          const matched = all.filter((m) => m.companyId === companyId && m.roId === roId);
          if (matched.length > 0) {
            return matched.sort((a, b) => Number(a.membraneNo) - Number(b.membraneNo));
          }
          // If this is Lion RO4 Pass 1 and no membranes found with this exact roId, return initial 30 membranes
          if (isLionRO4(companyId, roId, roName)) {
            const defaults = getDefaultLionRO4Membranes(roId, companyId);
            // Save into cache for future
            setCachedMembranes([...all.filter((m) => !(m.companyId === companyId && m.roId === roId)), ...defaults]);
            return defaults;
          }
          return [];
        }
        return all;
      }
    }
  } catch (e) {
    console.warn('Failed to read cached membranes:', e);
  }

  // Fallback if localStorage is empty: generate and store initial 30 membranes
  const defaultList = getDefaultLionRO4Membranes(roId || 'lion-ro-4', companyId || 'lion-corp');
  setCachedMembranes(defaultList);
  if (companyId && roId) {
    if (isLionRO4(companyId, roId, roName)) {
      return defaultList;
    }
    return [];
  }
  return defaultList;
}

export function setCachedMembranes(membranes: MembraneData[]): void {
  try {
    localStorage.setItem(STORAGE_MEMBRANES_KEY, JSON.stringify(membranes));
  } catch (e) {
    try {
      const lightweight = membranes.map((m) => ({
        ...m,
        chartImage: undefined,
        images: {
          before: m.images?.before ? m.images.before.slice(0, 1) : [],
          after: m.images?.after ? m.images.after.slice(0, 1) : []
        }
      }));
      localStorage.setItem(STORAGE_MEMBRANES_KEY, JSON.stringify(lightweight));
    } catch (err2) {
      // Ignore
    }
  }
}

// Quota-safe guard flag to prevent hammering Firestore when limit is reached
let isCloudQuotaBlocked = false;

export function getIsCloudQuotaBlocked(): boolean {
  return isCloudQuotaBlocked;
}

export function resetCloudQuotaBlock(): void {
  isCloudQuotaBlocked = false;
}

/**
 * Check if an error is quota related
 */
function isQuotaError(err: any): boolean {
  const str = String(err || '').toLowerCase();
  return (
    str.includes('quota') ||
    str.includes('resource_exhausted') ||
    str.includes('exceeded') ||
    str.includes('limit')
  );
}

/**
 * Fetch all Companies from Cloud Firestore directly.
 * Consumes only 1 read query.
 */
export async function fetchCompaniesFromCloud(): Promise<Company[]> {
  if (isCloudQuotaBlocked) {
    return getCachedCompanies();
  }
  try {
    const compSnap = await getDocs(collection(db, COMPANIES_COL));
    if (!compSnap.empty) {
      const list: Company[] = [];
      compSnap.forEach((docSnap) => {
        list.push(docSnap.data() as Company);
      });
      list.sort((a, b) => a.name.localeCompare(b.name, 'th'));
      setCachedCompanies(list);
      return list;
    }
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
      console.warn('Firestore Quota reached: switching to 100% offline local storage mode.');
    } else {
      console.warn('Could not fetch companies from cloud, using cache:', err);
    }
  }
  return getCachedCompanies();
}

/**
 * Fetch RO Systems for a specific Company directly from Cloud Firestore.
 */
export async function fetchROSystemsFromCloud(companyId: string): Promise<ROSystem[]> {
  if (!companyId || isCloudQuotaBlocked) return getCachedROSystems(companyId);
  try {
    const roQ = query(collection(db, RO_SYSTEMS_COL), where('companyId', '==', companyId));
    const roSnap = await getDocs(roQ);
    if (!roSnap.empty) {
      const list: ROSystem[] = [];
      roSnap.forEach((docSnap) => {
        list.push(docSnap.data() as ROSystem);
      });
      list.sort((a, b) => a.name.localeCompare(b.name, 'th', { numeric: true }));
      
      const allCached = getCachedROSystems().filter((r) => r.companyId !== companyId);
      setCachedROSystems([...allCached, ...list]);
      return list;
    }
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
      console.warn('Firestore Quota reached: switching to 100% offline local storage mode.');
    } else {
      console.warn('Could not fetch RO systems from cloud, using cache:', err);
    }
  }
  return getCachedROSystems(companyId);
}

/**
 * Fetch Membranes for a specific RO System directly from Cloud Firestore.
 * Implements session memory caching to achieve 0 reads when clicking between tabs.
 */
export async function fetchMembranesFromCloud(
  companyId: string,
  roId: string,
  roName?: string,
  forceRefresh = false
): Promise<MembraneData[]> {
  if (!companyId || !roId) return getCachedMembranes(companyId, roId, roName);

  const cacheKey = `${companyId}_${roId}`;

  // If already fetched in this session or quota blocked, return cached data (0 reads)
  if (!forceRefresh && (sessionFetchedROs.has(cacheKey) || isCloudQuotaBlocked)) {
    return getCachedMembranes(companyId, roId, roName);
  }

  try {
    const memQ = query(
      collection(db, MEMBRANES_COL),
      where('companyId', '==', companyId),
      where('roId', '==', roId)
    );
    const memSnap = await getDocs(memQ);

    if (!memSnap.empty) {
      const list: MembraneData[] = [];
      memSnap.forEach((docSnap) => {
        const data = docSnap.data() as MembraneData;
        list.push({
          ...data,
          id: docSnap.id,
          companyId: data.companyId || companyId,
          roId: data.roId || roId,
          headerConfig: data.headerConfig ? { ...data.headerConfig } : { ...defaultHeaderConfig }
        });
      });
      list.sort((a, b) => Number(a.membraneNo) - Number(b.membraneNo));
      
      // Update cache
      const allCached = getCachedMembranes().filter((m) => !(m.companyId === companyId && m.roId === roId));
      setCachedMembranes([...allCached, ...list]);
      sessionFetchedROs.add(cacheKey);
      return list;
    }
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
      console.warn('Firestore Quota reached: switching to 100% offline local storage mode.');
    } else {
      console.warn('Could not fetch membranes from cloud, using cache:', err);
    }
  }

  sessionFetchedROs.add(cacheKey);
  return getCachedMembranes(companyId, roId, roName);
}

/**
 * Save a Company directly to Cloud Firestore.
 */
export async function saveCompanyToCloud(company: Company): Promise<void> {
  const dataToSave = sanitizeForFirestore({
    ...company,
    createdAt: company.createdAt || new Date().toISOString()
  });

  const cached = getCachedCompanies();
  const existingIdx = cached.findIndex((c) => c.id === company.id);
  if (existingIdx >= 0) {
    cached[existingIdx] = dataToSave;
  } else {
    cached.push(dataToSave);
  }
  setCachedCompanies(cached);

  if (isCloudQuotaBlocked) return;

  try {
    const docRef = doc(db, COMPANIES_COL, company.id);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
    }
  }
}

/**
 * Delete a Company and its descendants directly from Cloud Firestore.
 */
export async function deleteCompanyFromCloud(companyId: string): Promise<void> {
  const cachedComps = getCachedCompanies().filter((c) => c.id !== companyId);
  setCachedCompanies(cachedComps);

  const cachedROs = getCachedROSystems().filter((r) => r.companyId !== companyId);
  setCachedROSystems(cachedROs);

  const cachedMems = getCachedMembranes().filter((m) => m.companyId !== companyId);
  setCachedMembranes(cachedMems);

  if (isCloudQuotaBlocked) return;

  try {
    await deleteDoc(doc(db, COMPANIES_COL, companyId));
    const roQ = query(collection(db, RO_SYSTEMS_COL), where('companyId', '==', companyId));
    const roSnapshot = await getDocs(roQ);
    if (!roSnapshot.empty) {
      const batch = writeBatch(db);
      roSnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    }
    const memQ = query(collection(db, MEMBRANES_COL), where('companyId', '==', companyId));
    const memSnapshot = await getDocs(memQ);
    if (!memSnapshot.empty) {
      const batch = writeBatch(db);
      memSnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    }
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
    }
  }
}

/**
 * Save an RO System directly to Cloud Firestore.
 */
export async function saveROSystemToCloud(roSystem: ROSystem): Promise<void> {
  const dataToSave = sanitizeForFirestore({
    ...roSystem,
    createdAt: roSystem.createdAt || new Date().toISOString()
  });

  const cached = getCachedROSystems();
  const existingIdx = cached.findIndex((r) => r.id === roSystem.id);
  if (existingIdx >= 0) {
    cached[existingIdx] = dataToSave;
  } else {
    cached.push(dataToSave);
  }
  setCachedROSystems(cached);

  if (isCloudQuotaBlocked) return;

  try {
    const docRef = doc(db, RO_SYSTEMS_COL, roSystem.id);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
    }
  }
}

/**
 * Delete an RO System directly from Cloud Firestore.
 */
export async function deleteROSystemFromCloud(roId: string): Promise<void> {
  const cachedROs = getCachedROSystems().filter((r) => r.id !== roId);
  setCachedROSystems(cachedROs);

  const cachedMems = getCachedMembranes().filter((m) => m.roId !== roId);
  setCachedMembranes(cachedMems);

  if (isCloudQuotaBlocked) return;

  try {
    await deleteDoc(doc(db, RO_SYSTEMS_COL, roId));
    const memQ = query(collection(db, MEMBRANES_COL), where('roId', '==', roId));
    const memSnapshot = await getDocs(memQ);
    if (!memSnapshot.empty) {
      const batch = writeBatch(db);
      memSnapshot.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
    }
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
    }
  }
}

/**
 * Save multiple membranes to Cloud Firestore in a single Batch operation.
 */
export async function saveBatchMembranesToCloud(membranesList: MembraneData[]): Promise<void> {
  if (membranesList.length === 0) return;

  const cached = getCachedMembranes();
  const updatedMembranes = [...cached];

  membranesList.forEach((m) => {
    const companyId = m.companyId || 'lion-corp';
    const roId = m.roId || 'lion-ro-4';
    const docId = m.id || `${companyId}_${roId}_${m.membraneNo}`;
    const sanitized = sanitizeForFirestore({
      ...m,
      id: docId,
      companyId,
      roId,
      updatedAt: new Date().toISOString()
    });

    const idx = updatedMembranes.findIndex((existing) => existing.id === docId);
    if (idx >= 0) {
      updatedMembranes[idx] = sanitized;
    } else {
      updatedMembranes.push(sanitized);
    }
  });

  setCachedMembranes(updatedMembranes);

  if (isCloudQuotaBlocked) return;

  try {
    const batch = writeBatch(db);
    membranesList.forEach((m) => {
      const companyId = m.companyId || 'lion-corp';
      const roId = m.roId || 'lion-ro-4';
      const docId = m.id || `${companyId}_${roId}_${m.membraneNo}`;
      const docRef = doc(db, MEMBRANES_COL, docId);
      const sanitized = sanitizeForFirestore({
        ...m,
        id: docId,
        companyId,
        roId,
        updatedAt: new Date().toISOString()
      });
      batch.set(docRef, sanitized, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
    }
  }
}

/**
 * Save a single Membrane document to Cloud Firestore.
 */
export async function saveMembraneToCloud(membrane: MembraneData): Promise<void> {
  const companyId = membrane.companyId || 'lion-corp';
  const roId = membrane.roId || 'lion-ro-4';
  const docId = membrane.id || `${companyId}_${roId}_${membrane.membraneNo}`;

  const rawData = {
    ...membrane,
    id: docId,
    companyId,
    roId,
    updatedAt: new Date().toISOString()
  };
  const dataToSave = sanitizeForFirestore(rawData);

  const cached = getCachedMembranes();
  const existingIdx = cached.findIndex(
    (m) => m.id === docId || (m.companyId === companyId && m.roId === roId && m.membraneNo === membrane.membraneNo)
  );
  if (existingIdx >= 0) {
    cached[existingIdx] = dataToSave;
  } else {
    cached.push(dataToSave);
  }
  setCachedMembranes(cached);

  if (isCloudQuotaBlocked) return;

  try {
    const docRef = doc(db, MEMBRANES_COL, docId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    if (isQuotaError(err)) {
      isCloudQuotaBlocked = true;
    }
  }
}

/**
 * Delete a Membrane document from Cloud Firestore.
 */
export async function deleteMembraneFromCloud(
  docId: string,
  companyId?: string,
  roId?: string,
  membraneNo?: number
): Promise<void> {
  let targetId = docId;
  if (!targetId && companyId && roId && membraneNo) {
    targetId = `${companyId}_${roId}_${membraneNo}`;
  }

  if (targetId) {
    const cachedMems = getCachedMembranes().filter((m) => m.id !== targetId);
    setCachedMembranes(cachedMems);

    if (isCloudQuotaBlocked) return;

    try {
      const docRef = doc(db, MEMBRANES_COL, targetId);
      await deleteDoc(docRef);
    } catch (err) {
      if (isQuotaError(err)) {
        isCloudQuotaBlocked = true;
      }
    }
  }
}

export interface FullBackupPayload {
  version: number;
  exportedAt: string;
  companies: Company[];
  roSystems: ROSystem[];
  membranes: MembraneData[];
}

/**
 * Export all local data as a downloadable JSON object
 */
export function exportFullBackup(): FullBackupPayload {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    companies: getCachedCompanies(),
    roSystems: getCachedROSystems(),
    membranes: getCachedMembranes()
  };
}

/**
 * Import and restore backup from JSON payload
 */
export function importFullBackup(payload: FullBackupPayload): boolean {
  try {
    if (!payload || !Array.isArray(payload.companies) || !Array.isArray(payload.roSystems) || !Array.isArray(payload.membranes)) {
      throw new Error('Invalid backup structure');
    }
    setCachedCompanies(payload.companies);
    setCachedROSystems(payload.roSystems);
    setCachedMembranes(payload.membranes);
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
}

