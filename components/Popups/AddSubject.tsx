import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import {Button} from '../Components'
import {Input, ColorInput, ColorPicker} from   '@mantine/core'
import styles from '../../styles/popup.module.css'
import { useMediaQuery } from '@mantine/hooks'
import { CreateDocument } from '../../config/firebase/storage'
import { useRouter } from 'next/router'
import { useAuth } from '../../config/firebase/auth'
import languages from '../../public/languages.json'
import { GoCheck } from 'react-icons/go'
import { arrayUnion, collection, doc, addDoc } from 'firebase/firestore'
import { db } from '../../config/firebase/firebase'

export default function AddSubject(props) {

  const user = useAuth()

  const colors = ['#25262b', '#868e96', '#fa5252', '#e64980', '#be4bdb', '#7950f2', '#4c6ef5', '#228be6', '#15aabf', '#12b886', '#40c057', '#82c91e', '#fab005', '#fd7e14']

  const [name, setName] = useState("")
  const [color, setColor] = useState(colors[0])
  const [error, setError] = useState("")

  const matches = useMediaQuery('(min-width: 768px)')

  async function Add(){
    if (!name || name.length < 3)  {
      setError("Subject name must contain at least 3 characters.")
      return
    }

    const docRef = doc(db, "users", user.uid)
    const colRef = collection(docRef, "subjects")
    const payload = {Name: name, Color: color}
    
    try{
      await addDoc(colRef, payload)
      setName("")
      setColor(colors[0])
      props.setOpen(false)
    } catch(error){
      console.log(error)
    }
  }

  return (
    <Popup props={props}>
      <div className={styles.innercontainer}>
        <h1 className={styles.h1}>Add subject</h1>
        <Input.Wrapper className={styles.textwrapper} label="Subject" error={error}>
          <Input invalid={error.length > 0} className={styles.textfield} value={name} onChange={(e) => {setName(e.target.value); setError("")}} placeholder="Enter subject name" variant='filled' size={matches ? "md" : "xs"}/>
        </Input.Wrapper>
        <div className={styles.colors}>
          <label>Color</label>
          <div style={{display:"flex", flexDirection: "row"}}>
            {colors?.map((col, i) => {
              return <button key={i} onClick={() => setColor(col)} style={{backgroundColor: col}} className={styles.color}>{color == col && <GoCheck />}</button>
            })}
          </div>
        </div>
        <div style={{margin: "1vw 0"}} />
        <Button onClick={() => Add()}>Add</Button>
      </div>
    </Popup>
  )
}
