import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, query, where, getDocs, addDoc, DocumentData } from "firebase/firestore";
import { db } from "./firebase";

export const getDocument = async <T = DocumentData>(coll: string, id: string): Promise<T | null> => {
  const docRef = doc(db, coll, id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return snap.data() as T;
  }
  return null;
};

export const setDocument = async (coll: string, id: string, data: any) => {
  await setDoc(doc(db, coll, id), data, { merge: true });
};

export const addDocument = async (coll: string, data: any) => {
  return await addDoc(collection(db, coll), data);
};

export const updateDocument = async (coll: string, id: string, data: any) => {
  const docRef = doc(db, coll, id);
  await updateDoc(docRef, data);
};

export const subscribeToCollection = (coll: string, callback: (data: any[]) => void, ...queryConstraints: any[]) => {
  const q = query(collection(db, coll), ...queryConstraints);
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const subscribeToDocument = (coll: string, id: string, callback: (data: any) => void) => {
  const docRef = doc(db, coll, id);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() });
    } else {
      callback(null);
    }
  });
};
