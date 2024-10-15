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
  
  export const getMainQuest = async (userId: string) => {
    try {
      const mainQuest = query(
        collection(db, "mainQuest"),
        where("uid", "==", userId)
      );
      const data = await getDocs(mainQuest);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return { data: filteredData };
    } catch (error) {
      return { error };
    }
  };
  
  export const addMainQuest = async (data: any) => {
    try {
      const docref = await addDoc(collection(db, "mainQuest"), {
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
  
  export const updateMainQuestMission = async (data: any) => {
    try {
      await updateDoc(doc(db, "mainQuest", data), {
        completedQuest: true,
      });
      return { status: "ok" };
    } catch (error) {
      return { error };
    }
  };

  export const updateMainQuestPunishment = async (data: any) => {
    try {
      await updateDoc(doc(db, "mainQuest", data), {
        completedPunishment: true,
      });
      return { status: "ok" };
    } catch (error) {
      return { error };
    }
  };
  
  export const deleteMainQuest = async (data: any) => {
    try {
      await deleteDoc(doc(db, "mainQuest", data));
      return { status: "ok" };
    } catch (error) {
      return { error };
    }
  };
  