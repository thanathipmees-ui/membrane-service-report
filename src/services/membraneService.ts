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
import { MembraneData } from '../types';
import { initialMembranes } from '../data/initialMembranes';
import { defaultHeaderConfig } from '../utils/calculations';

const COLLECTION_NAME = 'membranes';

export function subscribeMembranes(
  onData: (membranes: MembraneData[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COLLECTION_NAME);

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      if (snapshot.empty) {
        console.log('Firestore collection is empty. Seeding initial membranes...');
        try {
          await seedInitialData();
        } catch (err) {
          console.error('Error seeding initial membranes:', err);
        }
        return;
      }

      const list: MembraneData[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as MembraneData;
        list.push({
          ...data,
          headerConfig: data.headerConfig ? { ...data.headerConfig } : { ...defaultHeaderConfig }
        });
      });

      // Sort by membraneNo ascending
      list.sort((a, b) => Number(a.membraneNo) - Number(b.membraneNo));
      onData(list);
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Recursively cleans object for Firestore saving.
 * Converts `undefined` values to `null` to prevent Firestore `undefined` field errors.
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

export async function saveMembraneToCloud(membrane: MembraneData): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, String(membrane.membraneNo));
  const rawData = {
    ...membrane,
    updatedAt: new Date().toISOString()
  };
  const dataToSave = sanitizeForFirestore(rawData);
  await setDoc(docRef, dataToSave, { merge: true });
}

export async function deleteMembraneFromCloud(membraneNo: number): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, String(membraneNo));
  await deleteDoc(docRef);
}

export async function seedInitialData(): Promise<void> {
  const batch = writeBatch(db);
  initialMembranes.forEach((m) => {
    const docRef = doc(db, COLLECTION_NAME, String(m.membraneNo));
    const rawData = {
      ...m,
      headerConfig: m.headerConfig || { ...defaultHeaderConfig },
      updatedAt: new Date().toISOString()
    };
    const dataToSave = sanitizeForFirestore(rawData);
    batch.set(docRef, dataToSave);
  });
  await batch.commit();
}

export async function resetAllDataToDefault(): Promise<void> {
  // Get all existing docs and delete them
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  const deleteBatch = writeBatch(db);
  snapshot.forEach((docSnap) => {
    deleteBatch.delete(docSnap.ref);
  });
  await deleteBatch.commit();

  // Re-seed default membranes
  await seedInitialData();
}
