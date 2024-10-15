import { db } from "../firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

import { getDoc, setDoc } from "firebase/firestore"; // Import necessary Firestore methods

export const addStats = async (data: any) => {
  try {
    const docRef = doc(db, "stats", data.userId); // Get a reference to the existing document

    const docSnap = await getDoc(docRef); // Check if the document exists

    if (docSnap.exists()) {
      // Document exists, increment the 'exp' field
      await updateDoc(docRef, {
        exp: increment(data.exp),
      });
    } else {
      // Document does not exist, create it with initial exp
      await setDoc(docRef, {
        exp: data.exp,
        userId: data.userId, // Include userId if needed in the new document
      });
    }

    return {
      data: docRef.id,
      status: true,
    };
  } catch (error) {
    return { error };
  }
};

export const getUserStats = async (userId: string) => {
  try {
    const docRef = doc(db, "stats", userId); // Reference the document by userId
    const docSnap = await getDoc(docRef); // Fetch the document

    if (docSnap.exists()) {
      // Document exists, return the data
      return {
        data: docSnap.data(),
        status: true,
      };
    } else {
      // Document does not exist
      return {
        error: "No stats found for this user.",
        status: false,
      };
    }
  } catch (error) {
    // Handle errors
    return { error };
  }
};
