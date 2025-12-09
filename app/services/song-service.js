import {db} from '../utils/firebase.js';
import {doc, setDoc, serverTimestamp} from 'firebase/firestore';

//Function to add a song to the user's list
export async function addSongToList(userId, listId, song) {
    //Reference to the songs subcollection in the specified list
    const songsRef = doc(db, 'users', userId, 'lists', listId, 'songs', String(song.id));

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