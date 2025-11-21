import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const addRecurringTodo = async (data: any) => {
  try {
    const docref = await addDoc(collection(db, "recurringTodos"), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return { data: docref.id, status: true };
  } catch (error) {
    return { error };
  }
};

export const getRecurringTodos = async (userId: string) => {
  try {
    const q = query(collection(db, "recurringTodos"), where("uid", "==", userId));
    const data = await getDocs(q);
    const filtered = data.docs.map((d) => ({ ...d.data(), id: d.id }));
    return { data: filtered };
  } catch (error) {
    return { error };
  }
};

export const deleteRecurringTodo = async (id: string) => {
  try {
    await deleteDoc(doc(db, "recurringTodos", id));
    return { status: "ok" };
  } catch (error) {
    return { error };
  }
};
