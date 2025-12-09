import {db} from '../utils/firebase.js';
import { collection, addDoc, getDocs, serverTimestamp, doc} from 'firebase/firestore';
import { slugify } from '../utils/slugify.js'; //Import slugify function

//Function to get the lists of a user
export async function getLists(userId) {
    const listsRef = collection(db, 'users', userId, 'lists');
    const snapshot = await getDocs(listsRef);

    //Create an array to hold the lists
    const lists = [];

    //Iterate through the documents and push to the lists array
    snapshot.forEach((doc) => {
        lists.push({ id: doc.id, ...doc.data() });
    });

    return lists;
}

//Function to create a new list for a user
export async function createList(userId, name, description='') {
    const slug = slugify(name); //Generate slug from name

    const listsRef = collection(db, 'users', userId, 'lists');

    //Add a new document to the lists collection
    const docRef = await addDoc(listsRef, {
        name,
        description,
        createdAt: serverTimestamp(),
    });

    //Return the ID of the newly created document and the slug
    return {    id: docRef.id, name, description, slug };
}   