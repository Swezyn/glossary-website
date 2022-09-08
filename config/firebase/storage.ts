import { collection, onSnapshot, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from './firebase'
import { uuidv4 } from '@firebase/util'

export function ReadCollectionSnapshot(coll: string){
    const [doc, setDoc] = useState([])

    useEffect(() => {
        onSnapshot(collection(db, coll), (snapshot) => {
            setDoc(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        })
    })

    return doc
}

export async function ReadCollection(coll: string){
    const snapshot = await getDocs(collection(db, coll))
    const docs = snapshot.docs.map((doc) => doc.data())

    return docs
}

export async function ReadDocument(coll: string, id: string){
    const docRef = doc(db, coll, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()){
        return docSnap
    }
    return null
}

export function ReadDocumentSnapshot(coll: string, id: string){
    const collection = ReadCollectionSnapshot(coll)
    const doc = collection.filter(obj => {
        return obj.id === id
    })[0]

    return doc
}

export async function CreateDocument(coll: string, name: string, creator: string){
    const id = uuidv4()
    const docRef =  doc(db, coll, id)
    const payload = {Info: {Name: name, Creator: creator}}

    await setDoc(docRef, payload)

    return id
}

export async function UpdateDocument(coll: string, id: string, payload, merge: boolean){
    const docRef =  doc(db, coll, id)

    await setDoc(docRef, payload, {merge: merge})
}