import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Company, ROSystem, MembraneData } from '../types';
import { initialMembranes } from '../data/initialMembranes';
import { defaultHeaderConfig } from '../utils/calculations';

const COMPANIES_COL = 'companies';
const RO_SYSTEMS_COL = 'ro_systems';
const MEMBRANES_COL = 'membranes';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {},
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  return new Error(JSON.stringify(errInfo));
}

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
      jobDescription: 'Cleaning Membrane RO1 Pass1',
      reportTitle: 'RO1 Pass1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-2',
    companyId: 'lion-corp',
    name: 'RO2 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO2 Pass1',
      reportTitle: 'RO2 Pass1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-3',
    companyId: 'lion-corp',
    name: 'RO3 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO3 Pass1',
      reportTitle: 'RO3 Pass1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-4',
    companyId: 'lion-corp',
    name: 'RO4 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO4 Pass1',
      reportTitle: 'RO4 Pass1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  },
  {
    id: 'lion-ro-5',
    companyId: 'lion-corp',
    name: 'RO5 Pass 1',
    headerConfig: {
      ...defaultHeaderConfig,
      jobDescription: 'Cleaning Membrane RO5 Pass1',
      reportTitle: 'RO5 Pass1 Membrane Cleaning Report'
    },
    createdAt: new Date().toISOString()
  }
];

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
        if (companyId) return all.filter((r) => r.companyId === companyId);
        return all;
      }
    }
  } catch (e) {
    console.warn('Failed to read cached ro systems:', e);
  }
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

export function getCachedMembranes(companyId?: string, roId?: string): MembraneData[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEMBRANES_KEY);
    if (raw) {
      const all: MembraneData[] = JSON.parse(raw);
      if (Array.isArray(all) && all.length > 0) {
        if (companyId && roId) {
          return all.filter((m) => m.companyId === companyId && m.roId === roId);
        }
        return all;
      }
    }
  } catch (e) {
    console.warn('Failed to read cached membranes:', e);
  }
  const defaultList = initialMembranes.map((m) => ({
    ...m,
    id: m.id || `lion-corp_lion-ro-4_${m.membraneNo}`,
    companyId: m.companyId || 'lion-corp',
    roId: m.roId || 'lion-ro-4',
    headerConfig: m.headerConfig || { ...defaultHeaderConfig }
  }));
  if (companyId && roId) {
    return defaultList.filter((m) => m.companyId === companyId && m.roId === roId);
  }
  return defaultList;
}

export function setCachedMembranes(membranes: MembraneData[]): void {
  try {
    localStorage.setItem(STORAGE_MEMBRANES_KEY, JSON.stringify(membranes));
  } catch (e) {
    console.warn('Failed to write cached membranes:', e);
  }
}

/**
 * Subscribes to Companies real-time stream. Auto-seeds default company if empty.
 */
export function subscribeCompanies(
  onData: (companies: Company[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COMPANIES_COL);

  return onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('Companies collection is empty. Seeding default company & hierarchy...');
        try {
          await seedDefaultHierarchy();
        } catch (err) {
          console.error('Error seeding default hierarchy:', err);
        }
        return;
      }

      const list: Company[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as Company);
      });

      list.sort((a, b) => a.name.localeCompare(b.name, 'th'));
      setCachedCompanies(list);
      onData(list);
    },
    (error) => {
      const formattedErr = handleFirestoreError(error, OperationType.GET, COMPANIES_COL);
      console.warn('Firestore Companies error (using local cache fallback):', formattedErr.message);

      const cached = getCachedCompanies();
      onData(cached);

      if (onError) onError(formattedErr);
    }
  );
}

/**
 * Subscribes to RO Systems real-time stream for all systems or specific company.
 */
export function subscribeROSystems(
  companyId: string,
  onData: (roSystems: ROSystem[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, RO_SYSTEMS_COL);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: ROSystem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as ROSystem;
        if (data.companyId === companyId) {
          list.push(data);
        }
      });

      list.sort((a, b) => a.name.localeCompare(b.name, 'th', { numeric: true }));

      const currentAll = getCachedROSystems();
      const updatedAll = [...currentAll.filter((r) => r.companyId !== companyId), ...list];
      setCachedROSystems(updatedAll);

      onData(list);
    },
    (error) => {
      const formattedErr = handleFirestoreError(error, OperationType.GET, RO_SYSTEMS_COL);
      console.warn('Firestore RO Systems error (using local cache fallback):', formattedErr.message);

      const cached = getCachedROSystems(companyId);
      onData(cached);

      if (onError) onError(formattedErr);
    }
  );
}

/**
 * Subscribes to Membranes for a specific Company & RO System.
 */
export function subscribeMembranes(
  companyId: string,
  roId: string,
  onData: (membranes: MembraneData[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, MEMBRANES_COL);

  return onSnapshot(
    colRef,
    (snapshot) => {
      const list: MembraneData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as MembraneData;
        const docId = docSnap.id;

        const isMatch =
          (data.companyId === companyId && data.roId === roId) ||
          (!data.companyId && !data.roId && companyId === 'lion-corp' && roId === 'lion-ro-4');

        if (isMatch) {
          list.push({
            ...data,
            id: docId,
            companyId: data.companyId || 'lion-corp',
            roId: data.roId || 'lion-ro-4',
            headerConfig: data.headerConfig ? { ...data.headerConfig } : { ...defaultHeaderConfig }
          });
        }
      });

      list.sort((a, b) => Number(a.membraneNo) - Number(b.membraneNo));

      const currentAll = getCachedMembranes();
      const updatedAll = [
        ...currentAll.filter((m) => !(m.companyId === companyId && m.roId === roId)),
        ...list
      ];
      setCachedMembranes(updatedAll);

      onData(list);
    },
    (error) => {
      const formattedErr = handleFirestoreError(error, OperationType.GET, MEMBRANES_COL);
      console.warn('Firestore Membranes error (using local cache fallback):', formattedErr.message);

      const cached = getCachedMembranes(companyId, roId);
      onData(cached);

      if (onError) onError(formattedErr);
    }
  );
}

/**
 * Save / Update a Company
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

  try {
    const docRef = doc(db, COMPANIES_COL, company.id);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn('Cloud save company failed (saved locally):', err);
  }
}

/**
 * Delete a Company along with its RO Systems and Membrane reports.
 */
export async function deleteCompanyFromCloud(companyId: string): Promise<void> {
  const cachedComps = getCachedCompanies().filter((c) => c.id !== companyId);
  setCachedCompanies(cachedComps);

  const cachedROs = getCachedROSystems().filter((r) => r.companyId !== companyId);
  setCachedROSystems(cachedROs);

  const cachedMems = getCachedMembranes().filter((m) => m.companyId !== companyId);
  setCachedMembranes(cachedMems);

  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, COMPANIES_COL, companyId));

    const roSnapshot = await getDocs(collection(db, RO_SYSTEMS_COL));
    roSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as ROSystem;
      if (data.companyId === companyId) {
        batch.delete(docSnap.ref);
      }
    });

    const memSnapshot = await getDocs(collection(db, MEMBRANES_COL));
    memSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as MembraneData;
      if (data.companyId === companyId) {
        batch.delete(docSnap.ref);
      }
    });

    await batch.commit();
  } catch (err) {
    console.warn('Cloud delete company failed (deleted locally):', err);
  }
}

/**
 * Save / Update an RO System
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

  try {
    const docRef = doc(db, RO_SYSTEMS_COL, roSystem.id);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn('Cloud save RO system failed (saved locally):', err);
  }
}

/**
 * Delete an RO System along with its Membrane reports.
 */
export async function deleteROSystemFromCloud(roId: string): Promise<void> {
  const cachedROs = getCachedROSystems().filter((r) => r.id !== roId);
  setCachedROSystems(cachedROs);

  const cachedMems = getCachedMembranes().filter((m) => m.roId !== roId);
  setCachedMembranes(cachedMems);

  try {
    const batch = writeBatch(db);
    batch.delete(doc(db, RO_SYSTEMS_COL, roId));

    const memSnapshot = await getDocs(collection(db, MEMBRANES_COL));
    memSnapshot.forEach((docSnap) => {
      const data = docSnap.data() as MembraneData;
      if (data.roId === roId) {
        batch.delete(docSnap.ref);
      }
    });

    await batch.commit();
  } catch (err) {
    console.warn('Cloud delete RO system failed (deleted locally):', err);
  }
}

/**
 * Save / Update a Membrane document in Cloud Firestore.
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

  try {
    const docRef = doc(db, MEMBRANES_COL, docId);
    await setDoc(docRef, dataToSave, { merge: true });
  } catch (err) {
    console.warn('Cloud save membrane failed (saved locally):', err);
  }
}

/**
 * Delete a Membrane document.
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

    try {
      const docRef = doc(db, MEMBRANES_COL, targetId);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Cloud delete membrane failed (deleted locally):', err);
    }
  }
}

/**
 * Seeds default hierarchy: Lion Corp + RO1..RO5 + initialMembranes in RO4 Pass 1
 */
export async function seedDefaultHierarchy(): Promise<void> {
  setCachedCompanies([DEFAULT_COMPANY]);
  setCachedROSystems(DEFAULT_RO_SYSTEMS);
  setCachedMembranes(
    initialMembranes.map((m) => ({
      ...m,
      id: `${m.companyId || 'lion-corp'}_${m.roId || 'lion-ro-4'}_${m.membraneNo}`,
      companyId: 'lion-corp',
      roId: 'lion-ro-4',
      headerConfig: m.headerConfig || { ...defaultHeaderConfig },
      updatedAt: new Date().toISOString()
    }))
  );

  try {
    const batch = writeBatch(db);

    const compRef = doc(db, COMPANIES_COL, DEFAULT_COMPANY.id);
    batch.set(compRef, sanitizeForFirestore(DEFAULT_COMPANY));

    DEFAULT_RO_SYSTEMS.forEach((ro) => {
      const roRef = doc(db, RO_SYSTEMS_COL, ro.id);
      batch.set(roRef, sanitizeForFirestore(ro));
    });

    initialMembranes.forEach((m) => {
      const companyId = 'lion-corp';
      const roId = 'lion-ro-4';
      const docId = `${companyId}_${roId}_${m.membraneNo}`;
      const memRef = doc(db, MEMBRANES_COL, docId);

      const rawData = {
        ...m,
        id: docId,
        companyId,
        roId,
        headerConfig: m.headerConfig || { ...defaultHeaderConfig },
        updatedAt: new Date().toISOString()
      };
      batch.set(memRef, sanitizeForFirestore(rawData));
    });

    await batch.commit();
  } catch (err) {
    console.warn('Seeding default hierarchy to cloud failed (using local cache):', err);
  }
}
