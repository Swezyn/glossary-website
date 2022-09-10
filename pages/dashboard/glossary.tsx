import React, { useEffect, useState } from 'react'
import { ReadCollectionSnapshot } from '../../config/firebase/storage'
import styles from '../../styles/page.module.css'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../config/firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

export default function Glossary() {

  const user = useAuth()
  const [coll, setColl] = useState(null)

  useEffect(() => {
    return onSnapshot(collection(db, "glossarys"), (snapshot) => {
        setColl(snapshot.docs.map((doc) => (doc.data().Info.Creator == user?.uid ? {...doc.data(), id: doc.id} : null)))
    })
}, [user])

  return (
    <>
      <Header />
      <div className={styles.withsidebar}>
        <Sidebar active="glossary" />
        <div className={styles.container}>
            Glossary
            {coll?.map((doc) => 
            <div className={styles.glossary}>
                <a href={`/glossary/${doc?.id}`}>{doc?.Info.Name} by {doc?.Info.Creator}</a>
            </div>)}
        </div>
      </div>
    </>
  )
}
