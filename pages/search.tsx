import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { onSnapshot, collection } from 'firebase/firestore'
import { db } from '../config/firebase/firebase'
import styles from '../styles/page.module.css'
import Header from '../components/Header';
import Footer from '../components/Footer';
import languages from '../public/languages.json'

export default function search() {

    const router = useRouter()
    const searchInput : string = router.query.Input as string
    console.log(searchInput)

    const [coll, setColl] = useState([])

    useEffect(() => {
        return onSnapshot(collection(db, "glossarys"), (snapshot) => {
            setColl(snapshot.docs.map((doc) => (doc.data().Info.Name.toLowerCase().includes(searchInput.toLowerCase()) ? {...doc.data(), id: doc.id} : null)))
        })
    }, [searchInput])

  return (
    <>
        <Header />
        <div className={styles.container}>
            {coll.map((doc) => doc && <div key={doc?.id}><a className={styles.glossary} style={{textDecoration: "none"}} href={"/glossary/" + doc?.id}>
                <p>{doc?.Info?.Name}</p>
                <div className={styles.glossaryinnerbox}><p>{languages.find(obj => {return obj.value == doc?.Info?.Lang1})?.label}</p> <p>{languages.find(obj => {return obj.value == doc?.Info?.Lang2})?.label}</p></div>
            </a></div>)}
        </div>
        <Footer />
    </>
  )
}
