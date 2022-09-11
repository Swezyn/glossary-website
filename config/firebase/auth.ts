import { GoogleAuthProvider, TwitterAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, {useEffect, useState} from "react";
import { getAuth } from "firebase/auth";
import { app } from './firebase'

export const auth = getAuth(app);

export const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
}

export const twitterSignIn = () => {
  const provider = new TwitterAuthProvider();
  signInWithPopup(auth, provider)
}

export const emailSignIn = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password).then((result) =>{
    return ""
  }).catch((error) =>{
    return getError(error)
  })
}

export const emailSignUp = (first, last, email, password) => {
  return createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
    updateProfile(auth.currentUser, {
      displayName: `${first} ${last}`
    }).then(() => {
      return ""
    }).catch((error) => {
      return getError(error)
    })
  }).catch((error) => {
    return getError(error)
  })
}

export function useAuth(){
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => setCurrentUser(user))
    return unsub
  })

  return currentUser
}

export function logOut(){
  signOut(auth)
}

function getError(error){
  var string = error.code.substring(5).replaceAll('-', ' ')
  var uppercaseString = string.charAt(0).toUpperCase() + string.slice(1) + '.'
  return uppercaseString as string
}