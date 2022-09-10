import React, { useEffect, useState } from 'react'
import styles from '../../styles/page.module.css'
import Header from '../../components/Header'
import Sidebar from '../../components/Sidebar'
import AddTask from '../../components/Popups/AddTask'
import { Button } from '../../components/Components'
import { collection, doc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../../config/firebase/auth'
import { db } from '../../config/firebase/firebase'

export default function tasks() {

    const user = useAuth()

    const [tasks, setTasks] = useState([])
    const [subjects, setSubjects] = useState([])

    const [addTaskOpen, setAddTaskOpen] = useState(false)

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
                  return <li key={task.id}><div className={styles.colorbox} style={{backgroundColor: subjects.find(obj => {return obj.Name == task.Subject})?.Color}}/><p>{task.Heading}</p></li>
                }) : <><li><div className={styles.skeleton} /></li><li><div className={styles.skeleton} /></li><li><div className={styles.skeleton} /></li></>}
              </ul>
            </div>
        </div>
    </div>
    <div className={styles.cornerbuttons}>
      <Button onClick={() => setAddTaskOpen(true)} color="accent4">Add Task</Button>
    </div>
    <AddTask open={addTaskOpen} setOpen={setAddTaskOpen} />
    </>
  )
}
