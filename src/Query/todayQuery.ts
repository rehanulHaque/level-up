import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export const getTodayMission = async (userId: string) => {
  try {
    const todayMisson = query(
      collection(db, "todayMission"),
      where("uid", "==", userId)
    );
    const data = await getDocs(todayMisson);
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    return { data: filteredData };
  } catch (error) {
    return { error };
  }
};

export const addTodayMission = async (data: any) => {
  try {
    const docref = await addDoc(collection(db, "todayMission"), {
      ...data,
      timestamp: serverTimestamp(),
    });
    return {
      data: docref.id,
      status: true,
    };
  } catch (error) {
    return { error };
  }
};

export const updateTodayMission = async (data: any) => {
  try {
    await updateDoc(doc(db, "todayMission", data), {
      completed: true,
    });
    return { status: "ok" };
  } catch (error) {
    return { error };
  }
};

export const deleteTodayMission = async (data: any) => {
  try {
    await deleteDoc(doc(db, "todayMission", data));
    return { status: "ok" };
  } catch (error) {
    return { error };
  }
};
