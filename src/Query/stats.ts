import { db } from "../firebase";
import { doc, updateDoc, increment, serverTimestamp, getDoc, setDoc } from "firebase/firestore";

export const addStats = async (data: any) => {
  try {
    const docRef = doc(db, "stats", data.userId); // Get a reference to the user's stats document
    const docSnap = await getDoc(docRef); // Check if the document exists

    // let increaseStreak = false;
    let newStreakCount = 1;
    let maxStreak = 0;

    if (docSnap.exists()) {
      const lastCompleted = docSnap.data().lastCompleted?.toMillis();
      const lastCompletedDate = lastCompleted ? new Date(lastCompleted) : null;

      if (lastCompletedDate) {
        const currentDate = new Date();
        const daysDifference = Math.floor(
          (currentDate.getTime() - lastCompletedDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysDifference === 1) {
          // Continue streak if last completed was yesterday
          // increaseStreak = true;
          newStreakCount = docSnap.data().streakCount + 1;
          maxStreak = Math.max(newStreakCount, docSnap.data().maxStreak);
        } else if (daysDifference > 1) {
          // Streak broken, reset to 1
          newStreakCount = 1;
          maxStreak = Math.max(docSnap.data().streakCount, docSnap.data().maxStreak);
        }
      } else {
        // No previous completion date, start the streak
        // increaseStreak = true;
        newStreakCount = 1;
        maxStreak = 1;
      }

      // Update the document with new stats
      await updateDoc(docRef, {
        exp: increment(data.exp),
        lastCompleted: serverTimestamp(),
        streakCount: newStreakCount,
        maxStreak: maxStreak,
      });
    } else {
      // Document does not exist, initialize with default values
      await setDoc(docRef, {
        exp: data.exp,
        userId: data.userId,
        lastCompleted: serverTimestamp(),
        streakCount: 1,
        maxStreak: 1,
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
