import React, { useEffect, useState } from 'react'
import CreateGlossary from '../../components/Popups/CreateGlossary'
import AddTask from '../../components/Popups/AddTask';
import styles from '../../styles/page.module.css'
import Header from '../../components/Header';
import { useAuth } from '../../config/firebase/auth';
import { useRouter } from 'next/router';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/Components';
import Link from 'next/link';

export default function Dashboard() {

  const user = useAuth() || null
  const router = useRouter()

    const [createGlossaryOpen, setCreateGlossaryOpen] = useState(false)
    const [addTaskOpen, setAddTaskOpen] = useState(false)

    const [glossarys, setGlossarys] = useState([])
    const [theTimeout, setTheTimeout] = useState(undefined)

    useEffect(() => {
        return onSnapshot(collection(db, "glossarys"), (snapshot) => {
          setGlossarys(snapshot.docs.map((doc) => (doc.data().Info.Creator == user?.uid && {...doc.data(), id: doc.id})))
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
        <Sidebar active="dashboard" />
        <div className={styles.container}>
            <h1>Welcome back {user && user?.displayName.split(' ')[0]}</h1>
            <p>Upcomming Assignments</p>
            <div className={styles.verticallist}>
              <h2>Recent glossarys</h2>
              <ul>
                {glossarys.length > 0 ? glossarys.map((glossary, i) => {
                  return <Link href={`/glossary/${glossary.id}`}><a><li key={glossary.id}><p>{glossary.Info.Name}</p></li></a></Link>
                }) : <><li><div className={styles.skeleton} /></li><li><div className={styles.skeleton} /></li><li><div className={styles.skeleton} /></li></>}
              </ul>
            </div>
        </div>
      </div>
      <div className={styles.cornerbuttons}>
        <Button onClick={() => setAddTaskOpen(true)} color="accent4">Add Task</Button>
        <Button onClick={() => setCreateGlossaryOpen(true)} color="accent4">Create Glossary</Button>
      </div>
      <AddTask open={addTaskOpen} setOpen={setAddTaskOpen} />
      <CreateGlossary open={createGlossaryOpen} setOpen={setCreateGlossaryOpen} />
    </>
  )
}
