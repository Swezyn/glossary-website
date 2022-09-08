import React, { useState } from 'react'
import Popup from './Popup'
import {Button} from '../Components'
import {Input} from   '@mantine/core'
import styles from '../../styles/popup.module.css'
import { useMediaQuery } from '@mantine/hooks'
import { CreateDocument } from '../../config/firebase/storage'
import { useRouter } from 'next/router'
import { useAuth } from '../../config/firebase/auth'

export default function CreateGlossary(props) {

  const user = useAuth()

  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const [loading, setLoading] = useState(false)

  const matches = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  async function Create(){
    if (!user){
      setError("Not logged in!")
      return
    }
    if (name.length < 3){
      setError("Must contain at least 3 characters")
      return
    }

    try {
      setLoading(true)
      const id = await CreateDocument("glossarys", name, user.uid)
      setLoading(false)
      router.push(`/glossary/${id}`)
    } 
    catch {
      setError("There was a error. Please try again") 
    }
  }

  return (
    <Popup props={props} loading={loading}>
      <div className={styles.innercontainer}>
        <h1 className={styles.h1}>Create glossary</h1>
        <Input.Wrapper className={styles.textwrapper} label="Glossary Name" error={error}>
          <Input className={styles.textfield} value={name} invalid={error.length > 0} onChange={(e) => {setName(e.target.value); setError("")}} variant='filled' placeholder='ex. English Words w.35' radius="md" size={matches ? "md" : "xs"}/>
        </Input.Wrapper>
        <div style={{margin: "1vw 0"}} />
        <Button onClick={() => Create()}>Create</Button>
      </div>
    </Popup>
  )
}
