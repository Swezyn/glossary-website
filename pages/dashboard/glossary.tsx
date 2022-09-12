import React, { useEffect, useState } from 'react'
import { ReadCollectionSnapshot } from '../../config/firebase/storage'
import styles from '../../styles/page.module.css'
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../config/firebase/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';
import Link from 'next/link';
import { motion } from 'framer-motion'
import { Button } from '../../components/Components';
import languages from '../../public/languages.json'
import { useRouter } from 'next/router';

export default function Glossary() {
  const router = useRouter()
  const user = useAuth()
  const [glossarys, setGlossarys] = useState([])
  const [myGlossarys, setMyGlossarys] = useState([])

  const [createGlossaryOpen, setCreateGlossaryOpen] = useState(false)
  const [theTimeout, setTheTimeout] = useState(undefined)

  useEffect(() => {
    if (!user) return
      return onSnapshot(collection(db, "glossarys"), (snapshot) => {
        // setGlossarys(snapshot.docs.map((doc) => (doc.data().Info.Creator == user?.uid && {...doc.data(), id: doc.id})))

        const allGlossarys = snapshot.docs.map((doc) => ({...doc.data(), Info: doc.data().Info, id: doc.id}))
        setMyGlossarys(allGlossarys.filter(doc => {return doc.Info?.Creator == user.uid}))
        setGlossarys(allGlossarys.filter(doc => {return doc.Info?.Creator != user.uid}))
      })
  }, [user])

  useEffect(() => {
    if (!user)
      setTheTimeout(setTimeout(() => router.push("/"), 500))
    else
      return clearTimeout(theTimeout)
  }, [user])

  return (
    <>
      <Header />
      <div className={styles.withsidebar}>
        <Sidebar active="glossary" />
        <div className={styles.container}>
          <h1>Glossarys</h1>
          <div className={styles.verticallist}>
            <h2>My glossarys</h2>
            <ul>
              {myGlossarys.length > 0 ? myGlossarys.map((glossary, i) => {
                return <Link href={`/glossary/${glossary.id}`} key={glossary.id}><a><li>
                  <p>{glossary?.Info?.Name}</p>
                  <span className={styles.flex}>
                    <p className={styles.info}>{languages.find(obj => {return obj.value == glossary?.Info?.Lang1})?.label}</p>
                    <p className={styles.info}>{languages.find(obj => {return obj.value == glossary?.Info?.Lang2})?.label}</p>
                  </span></li></a></Link>
              }) : <li><p className={styles.skeleton}>You have no glossarys</p></li>}
            </ul>
          </div>
          <div className={styles.verticallist}>
            <h2>Other glossarys</h2>
            <ul>
              {glossarys.length > 0 ? glossarys.map((glossary, i) => {
                return <Link href={`/glossary/${glossary.id}`} key={glossary.id}><a><li>
                <p>{glossary?.Info?.Name}</p>
                <span className={styles.flex}>
                  <p className={styles.info}>{languages.find(obj => {return obj.value == glossary?.Info?.Lang1})?.label}</p>
                  <p className={styles.info}>{languages.find(obj => {return obj.value == glossary?.Info?.Lang2})?.label}</p>
                </span></li></a></Link>
              }) : <li><p className={styles.skeleton}>No other glossarys found</p></li>}
            </ul>
          </div>
        </div>
      </div>
      <motion.div className={styles.cornerbuttons} initial={{bottom: "-5vh"}} animate={{bottom: "2vh"}} transition={{delay: 0.25}}>
        <Button onClick={() => setCreateGlossaryOpen(true)} color="accent4">Create Glossary</Button>
      </motion.div>
    </>
  )
}
