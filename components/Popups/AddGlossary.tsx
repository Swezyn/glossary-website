import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import {Button} from '../Components'
import {Input} from   '@mantine/core'
import styles from '../../styles/popup.module.css'
import { useMediaQuery } from '@mantine/hooks'
import { UpdateDocument } from '../../config/firebase/storage'
import { useRouter } from 'next/router'
import { useAuth } from '../../config/firebase/auth'
import languages from '../../public/languages.json'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { arrayUnion } from 'firebase/firestore'

export default function AddGlossary(props) {

  const user = useAuth()

  const [language1, setLanguage1] = useState("")
  const [language2, setLanguage2] = useState("")

  const [canAdd, setCanAdd] = useState(true)

  const matches = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  async function Add(){
    const payload = {Glossary: arrayUnion({Lang1: language1, Lang2: language2})}
    
    try{
      setCanAdd(false)
      await UpdateDocument("glossarys", props.doc.id, payload, true)
      setCanAdd(true)
      setLanguage1("")
      setLanguage2("")
    } catch(error){
      console.log(error)
    }
  }

  return (
    <Popup props={props}>
      <div className={styles.innercontainer}>
        <h1 className={styles.h1}>Add to glossary</h1>
        <div className={styles.sideby}>
          <Input.Wrapper className={styles.textwrapper} label={languages.find(obj => {return obj.value == props.doc.Info.Lang1})?.label}>
            <Input className={styles.textfield} value={language1} onChange={(e) => setLanguage1(e.target.value)} variant='filled' size={matches ? "md" : "xs"}/>
          </Input.Wrapper>
          <div className={styles.arrow}>
            <MdOutlineKeyboardArrowRight size={30} />
          </div>
          <Input.Wrapper className={styles.textwrapper} label={languages.find(obj => {return obj.value == props.doc.Info.Lang2})?.label}>
            <Input className={styles.textfield} value={language2} onChange={(e) => setLanguage2(e.target.value)} variant='filled' size={matches ? "md" : "xs"}/>
          </Input.Wrapper>
        </div>
        <div style={{margin: "1vw 0"}} />
        <Button disabled={!canAdd} onClick={() => Add()}>Add</Button>
      </div>
    </Popup>
  )
}
