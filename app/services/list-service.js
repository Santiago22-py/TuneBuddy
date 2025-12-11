import { db } from "../utils/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
  query,
  where,
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { slugify } from "../utils/slugify.js"; //Import slugify function

////////////////////////////////////////////
//Function to get the lists of a user//////
///////////////////////////////////////////
export async function getLists(userId) {
  const listsRef = collection(db, "users", userId, "lists");
  const snapshot = await getDocs(listsRef);

  //Create an array to hold the lists
  const lists = [];

  //Iterate through the documents and push to the lists array
  snapshot.forEach((doc) => {
    lists.push({ id: doc.id, ...doc.data() });
  });

  return lists;
}

////////////////////////////////////////////
//Function to create a new list for a user//
////////////////////////////////////////////
export async function createList(userId, name, description = "") {
  const slug = slugify(name); //Generate slug from name

  const listsRef = collection(db, "users", userId, "lists");

  //Add a new document to the lists collection
  const docRef = await addDoc(listsRef, {
    name,
    description,
    slug,
    createdAt: serverTimestamp(),
  });

  //Return the ID of the newly created document and the slug
  return { id: docRef.id, name, description, slug };
}

////////////////////////////////////////////
//Function to get a list by its slug////////
////////////////////////////////////////////
export async function getListBySlug(userId, slug) {
  const listsRef = collection(db, "users", userId, "lists");
  const q = query(listsRef, where("slug", "==", slug));
  const snapshot = await getDocs(q);

  //If no document found, return null
  if (snapshot.empty) {
    return null; //No list found with that slug
  }

  //Otherwise, return the first matching document
  return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
}

////////////////////////////////////////////
//Function to update a list's details///////
////////////////////////////////////////////
export async function updateList(userId, listId, name, description = "") {
  const listRef = doc(db, "users", userId, "lists", listId);
  
  const newData = { name, description };

  //If name is changed, update slug as well
  if (name) {
    newData.slug = slugify(name);
  }

  await updateDoc(listRef, newData);

  return {slug: newData.slug}; //used to sync with local state
}

////////////////////////////////////////////
//Function to delete a list/////////////////
////////////////////////////////////////////
export async function deleteList(userId, listId) {
  const listRef = doc(db, "users", userId, "lists", listId);
  await deleteDoc(listRef);
}