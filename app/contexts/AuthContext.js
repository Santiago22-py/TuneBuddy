"use client";

import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { createUserProfile } from "../services/user-service.js";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Email sign up function
  const emailSignUp = async (email, password, displayName) => {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    // Update firebase user profile with display name
    await updateProfile(userCredential.user, { displayName });
    // Create user profile in Firestore
    await createUserProfile(userCredential.user, displayName);

    return userCredential;
  };

  // Email sign in function
  const emailSignIn = (email, password) => {
    // Sign in user with email and password
    return signInWithEmailAndPassword(auth, email, password); //Look at how simple this is, praised be Firebase
  };

  // Reused function from week 9 assignment ;)
  const firebaseSignOut = () => {
    return signOut(auth);
  };

  // Google sign in function
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Create user profile in Firestore if new user
    await createUserProfile(
      userCredential.user,
      userCredential.user.displayName
    );

    return userCredential;
  };

  // Github sign in function

  const githubSignIn = async () => {
    const provider = new GithubAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // GitHub doest always have displayName, fallback to username login
    const displayName =
      result.user.displayName ||
      result.user.reloadUserInfo?.screenName || // GitHub username
      "New User";

    await updateProfile(result.user, { displayName });

    // Create Firestore profile if first time
    await createUserProfile(result.user, displayName);

    return result;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Auth state changed. Current user:", currentUser);
    });
    return () => unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        emailSignUp,
        emailSignIn,
        googleSignIn,
        githubSignIn,
        firebaseSignOut,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  return useContext(AuthContext);
};
