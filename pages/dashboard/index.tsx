import React, { useEffect, useState } from 'react'
import CreateGlossary from '../../components/Popups/CreateGlossary'
import AddTask from '../../components/Popups/AddTask';
import styles from '../../styles/page.module.css'
import Header from '../../components/Header';
import { useAuth } from '../../config/firebase/auth';
import { useRouter } from 'next/router';
import { onSnapshot, collection, doc } from 'firebase/firestore';
import { db } from '../../config/firebase/firebase';
import Sidebar from '../../components/Sidebar';
import { Button } from '../../components/Components';
import Link from 'next/link';
import { motion } from 'framer-motion'
import languages from '../../public/languages.json'

export default function Dashboard() {

  const user = useAuth() || null
  const router = useRouter()

    const [createGlossaryOpen, setCreateGlossaryOpen] = useState(false)
    const [addTaskOpen, setAddTaskOpen] = useState(false)

    const [tasks, setTasks] = useState([])
    const [subjects, setSubjects] = useState([])
    const [myGlossarys, setMyGlossarys] = useState([])
    const [theTimeout, setTheTimeout] = useState(undefined)

    useEffect(() => {
      if (!user) return
        return onSnapshot(collection(db, "glossarys"), (snapshot) => {
          // setGlossarys(snapshot.docs.map((doc) => (doc.data().Info.Creator == user?.uid && {...doc.data(), id: doc.id})))

          const allGlossarys = snapshot.docs.map((doc) => ({...doc.data(), id: doc.id}))
          setMyGlossarys(allGlossarys.filter((doc) => {return doc.Info?.Creator == user.uid}))
        })
    }, [user])

    useEffect(() => {
      if (!user) return
      const docRef = doc(db, "users", user.uid)
      const colRef = collection(docRef, "tasks")
  
      return onSnapshot(colRef, (snapshot) => {
        setTasks(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
      })
    }, [user])

    useEffect(() => {
      if (!user) return
      const docRef = doc(db, "users", user.uid)
      const colRef = collection(docRef, "subjects")
  
      return onSnapshot(colRef, (snapshot) => {
        setSubjects(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
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
            <div className={styles.flex}>
              <div className={styles.verticallist} style={{width: "50%", marginRight: "5%"}}>
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
              <div className={styles.verticallist} style={{width: "30%"}}>
                <h2>My tasks</h2>
                <ul>
                  {tasks.length > 0 ? tasks.map((task, i) => {
                    return <li key={task.id}><span className={styles.flex}><div className={styles.colorbox} style={{backgroundColor: subjects.find(obj => {return obj.Name == task.Subject})?.Color}}/><p>{task.Heading}</p></span></li>
                  }) : <li><p className={styles.skeleton}>You have no tasks</p></li>}
                </ul>
              </div>
            </div>
        </div>
      </div>
      <motion.div className={styles.cornerbuttons} initial={{bottom: "-5vh"}} animate={{bottom: "2vh"}} transition={{delay: 0.25}}>
        <Button onClick={() => setAddTaskOpen(true)} color="accent4">Add Task</Button>
        <Button onClick={() => setCreateGlossaryOpen(true)} color="accent4">Create Glossary</Button>
      </motion.div>
      <AddTask open={addTaskOpen} setOpen={setAddTaskOpen} />
      <CreateGlossary open={createGlossaryOpen} setOpen={setCreateGlossaryOpen} />
    </>
  )
}
