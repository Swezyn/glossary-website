import React, { useEffect, useState } from 'react'
import styles from '../../styles/page.module.css'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import AddTask from '../../components/Popups/AddTask'
import { Button } from '../../components/Components'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../../config/firebase/auth'
import { db } from '../../config/firebase/firebase'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

export default function tasks() {

    const user = useAuth()
    const router = useRouter()

    const [tasks, setTasks] = useState([])
    const [subjects, setSubjects] = useState([])

    const [addTaskOpen, setAddTaskOpen] = useState(false)

    const [theTimeout, setTheTimeout] = useState(undefined)

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
    <Header/>
    <div className={styles.withsidebar}>
        <Sidebar active="tasks" />
        <div className={styles.container}>
            <h1>Tasks</h1>
            <div className={styles.verticallist}>
              <h2>Due Today</h2>
              <ul>
                {tasks.length > 0 ? tasks.map((task, i) => {
                  return <li key={task.id}><span className={styles.flex}><div className={styles.colorbox} style={{backgroundColor: subjects.find(obj => {return obj.Name == task.Subject})?.Color}}/><p>{task.Heading}</p></span></li>
                }) : <li><p className={styles.skeleton}>You have no tasks</p></li>}
              </ul>
            </div>
        </div>
    </div>
    <motion.div className={styles.cornerbuttons} initial={{bottom: "-5vh"}} animate={{bottom: "2vh"}} transition={{delay: 0.25}}>
      <Button onClick={() => setAddTaskOpen(true)} color="accent4">Add Task</Button>
    </motion.div>
    <AddTask open={addTaskOpen} setOpen={setAddTaskOpen} />
    </>
  )
}
