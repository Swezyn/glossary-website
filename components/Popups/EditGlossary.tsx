import React, { useEffect, useState } from 'react'
import Popup from './Popup'
import {Button} from '../Components'
import {Input, Select} from   '@mantine/core'
import styles from '../../styles/popup.module.css'
import { useMediaQuery } from '@mantine/hooks'
import { UpdateDocument } from '../../config/firebase/storage'
import { useRouter } from 'next/router'
import { useAuth } from '../../config/firebase/auth'
import { FaFlag } from 'react-icons/fa'
import languages from '../../public/languages.json'

let propsSet = false

export default function EditGlossary(props) {

  const user = useAuth()

  const [name, setName] = useState("")
  const [error, setError] = useState({Name: "", Lang1: "", Lang2: ""})

  const [language1, setLanguage1] = useState("")
  const [language2, setLanguage2] = useState("")

  const [loading, setLoading] = useState(false)

  const matches = useMediaQuery('(min-width: 768px)')
  const router = useRouter()

  useEffect(() => {
    if (propsSet === false && props.doc !== undefined){
      propsSet = true;
      setName(props.doc.Info.Name)
      setLanguage1(props.doc.Info.Lang1)
      setLanguage2(props.doc.Info.Lang2)
    }
  }, [props.doc])

  async function Edit(){
    if (name.length < 3) {setError({...error, Name: "Must contain at least 3 characters"}); return}
    if (language1.length <= 0) {setError({...error, Lang1: "Required"}); return}
    if (language2.length <= 0) {setError({...error, Lang2: "Required"}); return}

    if (language1 == language2) {setError({...error, Lang1: "Language 1 and 2 cannot be equal"})}

    if (name === props.doc.Info.Name && language1 === props.doc.Info.Lang1 && language2 === props.doc.Info.Lang2) {
      props.setOpen(false)
      return
    }

    const payload = {Info: {Name: name, Lang1: language1, Lang2: language2}}
    
    try{
      setLoading(true)
      await UpdateDocument("glossarys", props.doc.id, payload, true)
      setLoading(false)
      props.setOpen(false)
    } catch(error){
      console.log(error)
    }
  }

  return (
    <Popup props={props} loading={loading}>
      <div className={styles.innercontainer}>
        <h1 className={styles.h1}>Edit glossary</h1>
        <Input.Wrapper className={styles.textwrapper} label="Glossary Name" error={error.Name}>
          <Input className={styles.textfield} value={name} invalid={error.Name.length > 0} onChange={(e) => {setName(e.target.value); setError({...error, Name: ""})}} variant='filled' radius="md" size={matches ? "md" : "xs"}/>
        </Input.Wrapper>
        <div className={styles.sideby}>
          <Select error={error.Lang1} variant='filled' label="Language 1" data={languages} value={language1} onChange={(e) => {setLanguage1(e); setError({...error, Lang1: ""})}} icon={<FaFlag size={10} />} searchable nothingFound="No options" transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease"/>
          <Select error={error.Lang2} variant='filled' label="Language 2" data={languages} value={language2} onChange={(e) => {setLanguage2(e); setError({...error, Lang2: ""})}} icon={<FaFlag size={10} />} searchable nothingFound="No options" transition="pop-top-left" transitionDuration={80} transitionTimingFunction="ease"/>
        </div>
        <div style={{margin: "1vw 0"}} />
        <Button onClick={() => Edit()}>Submit Changes</Button>
      </div>
    </Popup>
  )
}
