import { db } from "../utils/firebase.js";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

//Function to add a song to the user's list
export async function addSongToList(userId, listId, song) {
  //Reference to the songs subcollection in the specified list
  const songsRef = doc(
    db,
    "users",
    userId,
    "lists",
    listId,
    "songs",
    String(song.id)
  );

  //Add the song document to the songs subcollection
  await setDoc(songsRef, {
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: song.artwork,
    previewUrl: song.previewUrl,
    addedAt: serverTimestamp(),
  });

  return song.id; //Return the song ID after adding
}

//Function to get all the songs in a list
export async function getAllSongs(userId, listId) {
  const songsRef = collection(db, "users", userId, "lists", listId, "songs");

  const snapshot = await getDocs(songsRef);
  const songs = [];

  //for each document in the snapshot, push to songs array
  snapshot.forEach((doc) => {
    songs.push({ id: doc.id, ...doc.data() });
  });

  return songs;
}

//Function to delete a song from a list
  export async function deleteSongFromList(userId, listId, songId) {
    const songRef = doc(
      db,
      "users",
      userId,
      "lists",
      listId,
      "songs",
      String(songId)
    );

    await deleteDoc(songRef);
  }
