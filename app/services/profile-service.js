import { db, storage } from "../utils/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

////////////////////////////////////////////
//Function to get user profile /////////////
///////////////////////////////////////////
export async function getUserProfile(userId) {
  if (!userId) {
    throw new Error("User ID is required to get profile."); //User ID is mandatory
  }

  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  //If user still doesnt have a profile, create a default one
  if (!userSnap.exists()) {
    const defaultProfile = {
      displayName: "New User",
      aboutMe: "I like music!",
      avatarUrl: "", //Empty avatar by default
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, defaultProfile);
    return { id: userId, ...defaultProfile };
  }
  return { id: userId, ...userSnap.data() };
}

////////////////////////////////////////////
//Function to update user profile /////////
///////////////////////////////////////////

export async function updateUserProfile(
  userId,
  { displayName, aboutMe, avatarUrl }
) {
  if (!userId) {
    throw new Error("User ID is required to update profile."); //User ID is mandatory
  }

  const userRef = doc(db, "users", userId);
  const newData = {};

  //Only update fields that are provided (not undefined)
  if (typeof displayName === "string") newData.displayName = displayName;
  if (typeof aboutMe === "string") newData.aboutMe = aboutMe;
  if (typeof avatarUrl === "string") newData.avatarUrl = avatarUrl;

  await updateDoc(userRef, newData);
}

///////////////////////////////////////////////////////////////////////////////
//Function to upload user avatar to Firebase Storage (and return URL) /////////
///////////////////////////////////////////////////////////////////////////////
export async function uploadUserAvatar(userId, file) {
  if (!userId) {
    throw new Error("User ID is required to upload avatar."); //User ID is mandatory
  }
  if (!file) {
    throw new Error("File is required to upload avatar."); //File is mandatory
  }

  const fileExtension = file.name.split(".").pop(); //Get file extension
  const avatarRef = ref(
    storage,
    `avatars/${userId}/avatar-${Date.now()}.${fileExtension}`
  );

  try {
    await uploadBytes(avatarRef, file); //Upload file to Firebase Storage

    //Get the download URL
    const downloadURL = await getDownloadURL(avatarRef);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
}
