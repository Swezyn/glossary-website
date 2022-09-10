import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import {Button} from '../Components'
import {Input, Select} from   '@mantine/core'
import styles from '../../styles/popup.module.css'
import { useMediaQuery } from '@mantine/hooks'
import { useRouter } from 'next/router'
import { useAuth } from '../../config/firebase/auth'
import { GoCheck } from 'react-icons/go'
import { collection, doc, addDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../config/firebase/firebase'
import AddSubject from './AddSubject'

export default function AddTask(props) {

  const user = useAuth()

  const [heading, setHeading] = useState("")
  const [subject, setSubject] = useState("")
  const [error, setError] = useState({Heading: "", Subject: ""})

  const [canAdd, setCanAdd] = useState(true)

  const matches = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  const [subjects, setSubjects] = useState(null)
  const [addSubjectOpen, setAddSubjectOpen] = useState(false)

  useEffect(() => {
    if (!user) return
    const docRef = doc(db, "users", user.uid)
    const colRef = collection(docRef, "subjects")

    return onSnapshot(colRef, (snapshot) => {
      setSubjects(snapshot.docs.map((doc) => (doc.data().Name)));
      setSubject(snapshot?.docs[0]?.data().Name)
    })
  }, [user])

  async function Add(){
    if (!heading || heading.length < 3){
      setError({...error, Heading: "Task name must contain at least 3 characters."})
      return
    }
    if (!subject){
      setError({...error, Subject: "Subject cannot be empty."})
      return
    }

    const docRef = doc(db, "users", user.uid)
    const colRef = collection(docRef, "tasks")
    const payload = {Heading: heading, Subject: subject}
    
    try{
      await addDoc(colRef, payload)
      props.setOpen(false)
    } catch(error){
      console.log(error)
    }
  }

  const colors = ['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']

  return (
    <>
      {!addSubjectOpen &&
      <Popup props={props}>
        <div className={styles.innercontainer}>
          <h1 className={styles.h1}>Add task</h1>
          <Input.Wrapper className={styles.textwrapper} label="Task Name" error={error.Heading}>
            <Input invalid={error.Heading.length > 0} className={styles.textfield} value={heading} onChange={(e) => {setHeading(e.target.value); setError({...error, Heading: ""})}} placeholder="Enter task name" variant='filled' size={matches ? "md" : "xs"}/>
          </Input.Wrapper>
          <Select error={error.Subject} placeholder={subjects?.length <= 0 && "Please add a subject"} label="Select subject" value={subject} onChange={(e) => setSubject(e)} data={subjects} style={{width:"80%", transform: !matches && "translateX(-10%)"}} rightSection={<button onClick={() => setAddSubjectOpen(true)} className={styles.inputbutton} color="grey">Add</button>} rightSectionWidth={matches ? 100 : 50} variant='filled' size={matches ? "md" : "xs"}/>
          <div style={{margin: "1vw 0"}} />
          <Button disabled={!canAdd} onClick={() => Add()}>Add</Button>
        </div>
      </Popup>
}
      <AddSubject open={addSubjectOpen} setOpen={setAddSubjectOpen} />
    </>
  )
}
