import React, { useEffect, useState } from 'react'
import CreateGlossary from '../components/Popups/CreateGlossary'
import styles from '../styles/page.module.css'
import Header from '../components/Header';
import { useAuth } from '../config/firebase/auth';
import { useRouter } from 'next/router';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../config/firebase/firebase';

export default function Dashboard() {

  const user = useAuth() || null
  const router = useRouter()

    const [createGlossaryOpen, setCreateGlossaryOpen] = useState(false)

    const [coll, setColl] = useState([])
    const [theTimeout, setTheTimeout] = useState(undefined)

    useEffect(() => {
        return onSnapshot(collection(db, "glossarys"), (snapshot) => {
            setColl(snapshot.docs.map((doc) => (doc.data().Info.Creator == user?.uid ? {...doc.data(), id: doc.id} : null)))
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
      <div className={styles.container}>
          <h1>Welcome back {user && user?.displayName.split(' ')[0]}</h1>
          <p>Upcomming Assignments</p>
          <p>Recent glossarys</p>
          <button onClick={() => setCreateGlossaryOpen(true)}>Create glossary</button>
          <CreateGlossary open={createGlossaryOpen} setOpen={setCreateGlossaryOpen} />
      </div>
    </>
  )
}
