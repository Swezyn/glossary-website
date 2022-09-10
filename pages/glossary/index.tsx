import React, { useEffect, useState } from 'react'
import { ReadCollectionSnapshot } from '../../config/firebase/storage'
import styles from '../../styles/page.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';

export default function Glossary() {

  const [coll, setColl] = useState(null)

  useEffect(() => {
    return onSnapshot(collection(db, "glossarys"), (snapshot) => {
        setColl(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    })
  }, [])

  return (
    <>
      <Header />
      <div className={styles.container}>
          Glossary
          {coll?.map((doc) => 
          <div className={styles.glossary}>
              <a href={`/glossary/${doc?.id}`}>{doc?.Info.Name} by {doc?.Info.Creator}</a>
          </div>)}
      </div>
      <Footer />
    </>
  )
}
