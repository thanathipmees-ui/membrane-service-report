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
      onData(list);
    },
    (error) => {
      console.error('Companies subscription error:', error);
      if (onError) onError(error);
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
      onData(list);
    },
    (error) => {
      console.error('RO Systems subscription error:', error);
      if (onError) onError(error);
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

        // Match if explicit companyId & roId match
        const isMatch =
          (data.companyId === companyId && data.roId === roId) ||
          // Backward compatibility for legacy docs without companyId/roId mapping to lion-corp / lion-ro-4
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

      // Sort by membraneNo ascending
      list.sort((a, b) => Number(a.membraneNo) - Number(b.membraneNo));
      onData(list);
    },
    (error) => {
      console.error('Membranes subscription error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Save / Update a Company
 */
export async function saveCompanyToCloud(company: Company): Promise<void> {
  const docRef = doc(db, COMPANIES_COL, company.id);
  const dataToSave = sanitizeForFirestore({
    ...company,
    createdAt: company.createdAt || new Date().toISOString()
  });
  await setDoc(docRef, dataToSave, { merge: true });
}

/**
 * Delete a Company along with its RO Systems and Membrane reports.
 */
export async function deleteCompanyFromCloud(companyId: string): Promise<void> {
  const batch = writeBatch(db);

  // Delete company document
  batch.delete(doc(db, COMPANIES_COL, companyId));

  // Find & delete related RO Systems
  const roSnapshot = await getDocs(collection(db, RO_SYSTEMS_COL));
  roSnapshot.forEach((docSnap) => {
    const data = docSnap.data() as ROSystem;
    if (data.companyId === companyId) {
      batch.delete(docSnap.ref);
    }
  });

  // Find & delete related Membranes
  const memSnapshot = await getDocs(collection(db, MEMBRANES_COL));
  memSnapshot.forEach((docSnap) => {
    const data = docSnap.data() as MembraneData;
    if (data.companyId === companyId) {
      batch.delete(docSnap.ref);
    }
  });

  await batch.commit();
}

/**
 * Save / Update an RO System
 */
export async function saveROSystemToCloud(roSystem: ROSystem): Promise<void> {
  const docRef = doc(db, RO_SYSTEMS_COL, roSystem.id);
  const dataToSave = sanitizeForFirestore({
    ...roSystem,
    createdAt: roSystem.createdAt || new Date().toISOString()
  });
  await setDoc(docRef, dataToSave, { merge: true });
}

/**
 * Delete an RO System along with its Membrane reports.
 */
export async function deleteROSystemFromCloud(roId: string): Promise<void> {
  const batch = writeBatch(db);

  // Delete RO System document
  batch.delete(doc(db, RO_SYSTEMS_COL, roId));

  // Find & delete related Membranes
  const memSnapshot = await getDocs(collection(db, MEMBRANES_COL));
  memSnapshot.forEach((docSnap) => {
    const data = docSnap.data() as MembraneData;
    if (data.roId === roId) {
      batch.delete(docSnap.ref);
    }
  });

  await batch.commit();
}

/**
 * Save / Update a Membrane document in Cloud Firestore.
 */
export async function saveMembraneToCloud(membrane: MembraneData): Promise<void> {
  const companyId = membrane.companyId || 'lion-corp';
  const roId = membrane.roId || 'lion-ro-4';
  const docId = membrane.id || `${companyId}_${roId}_${membrane.membraneNo}`;

  const docRef = doc(db, MEMBRANES_COL, docId);
  const rawData = {
    ...membrane,
    id: docId,
    companyId,
    roId,
    updatedAt: new Date().toISOString()
  };
  const dataToSave = sanitizeForFirestore(rawData);
  await setDoc(docRef, dataToSave, { merge: true });
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
    const docRef = doc(db, MEMBRANES_COL, targetId);
    await deleteDoc(docRef);
  }
}

/**
 * Seeds default hierarchy: Lion Corp + RO1..RO5 + initialMembranes in RO4 Pass 1
 */
export async function seedDefaultHierarchy(): Promise<void> {
  const batch = writeBatch(db);

  // 1. Seed Company
  const compRef = doc(db, COMPANIES_COL, DEFAULT_COMPANY.id);
  batch.set(compRef, sanitizeForFirestore(DEFAULT_COMPANY));

  // 2. Seed RO Systems (RO1 - RO5)
  DEFAULT_RO_SYSTEMS.forEach((ro) => {
    const roRef = doc(db, RO_SYSTEMS_COL, ro.id);
    batch.set(roRef, sanitizeForFirestore(ro));
  });

  // 3. Seed initial membranes into Lion Corp -> RO4 Pass 1
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
}
