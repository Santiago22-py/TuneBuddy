import { db } from "../utils/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// Function to create a user profile in Firestore
export async function createUserProfile(user, displayName) {
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  // If user profile doesn't exist, create it
  if (userSnap.exists()) {
    return;
  }

  await setDoc(userRef, {
    username: displayName,
    avatarUrl: null,
    aboutMe: "",
    createdAt: serverTimestamp(),
  });
}
