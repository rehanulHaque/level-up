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
  
  export const getSideQuest = async (userId: string) => {
    try {
      const sideQuest = query(
        collection(db, "sideQuest"),
        where("uid", "==", userId)
      );
      const data = await getDocs(sideQuest);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return { data: filteredData };
    } catch (error) {
      return { error };
    }
  };
  
  export const addSideQuest = async (data: any) => {
    try {
      const docref = await addDoc(collection(db, "sideQuest"), {
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
  
  export const updateSideQuestMission = async (data: any) => {
    try {
      await updateDoc(doc(db, "sideQuest", data), {
        completedQuest: true,
      });
      return { status: "ok" };
    } catch (error) {
      return { error };
    }
  };

  export const updateSideQuestPunishment = async (data: any) => {
    try {
      await updateDoc(doc(db, "sideQuest", data), {
        completedPunishment: true,
      });
      return { status: "ok" };
    } catch (error) {
      return { error };
    }
  };
  
  export const deleteSideQuest = async (data: any) => {
    try {
      await deleteDoc(doc(db, "sideQuest", data));
      return { status: "ok" };
    } catch (error) {
      return { error };
    }
  };
  