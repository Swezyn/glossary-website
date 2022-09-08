import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../../../styles/page.module.css'
import { Input } from '@mantine/core'
import Header from '../../../components/Header'
import languages from '../../../public/languages.json'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../../config/firebase/firebase'
import { useMediaQuery } from '@mantine/hooks'
import { Button } from '../../../components/Components'
import {AiOutlineCheckCircle, AiOutlineCloseCircle} from 'react-icons/ai'
import { motion } from 'framer-motion'
import { compareTwoStrings} from 'string-similarity'

export default function practise() {

  const router = useRouter()
  const id: string = router.query.id as string
  const type: string = router.query.type as string
  const lang: string = router.query.lang as string

  const matches = useMediaQuery('(min-width: 768px)')

  const [document, setDoc] = useState(null)
  const [glossaryIndex, setGlossaryIndex] = useState(0)
  const [glossaryArr, setGlossaryArr] = useState([])
  const [glossary, setGlossary] = useState({label1: "", label2: "", read: "", answer: ""})
  const [input, setInput] = useState("")
  const [revealedLetters, setRevealedLetters] = useState("")
  const [alert, setAlert] = useState({H: "", p: "", class: ""})

  useEffect(() => {
    async function GetDocument(){
      if (!id) return
      const docRef = doc(db, "glossarys", id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()){
        setDoc(docSnap.data())
      }
    }

    GetDocument()
  }, [id])

  useEffect(() => {
    if (document){
      setGlossaryArr(document.Glossary.sort(() => Math.random() - 0.5))
    }
  }, [document])

  useEffect(() => {
    if (document && glossaryArr){
      Setup()
    }
  }, [glossaryArr])

  function Setup()
  {
    console.log(glossaryArr)
    console.log(glossaryIndex)
    if (lang === '1-2'){
      setGlossary({
        label1: languages.find(obj => {return obj.value == document?.Info?.Lang1})?.label, 
        label2: languages.find(obj => {return obj.value == document?.Info?.Lang2})?.label, 
        read: glossaryArr[glossaryIndex].Lang1, 
        answer: glossaryArr[glossaryIndex].Lang2
      })
    }
    else if (lang === '2-1'){
      setGlossary({
        label1: languages.find(obj => {return obj.value == document.Info?.Lang2})?.label, 
        label2: languages.find(obj => {return obj.value == document.Info?.Lang1})?.label, 
        read: glossaryArr[glossaryIndex].Lang2, 
        answer: glossaryArr[glossaryIndex].Lang1
      })
    }
    else if (lang === 'mixed'){
      if (Math.random() < 0.5){
        setGlossary({
          label1: languages.find(obj => {return obj.value == document?.Info?.Lang1})?.label, 
          label2: languages.find(obj => {return obj.value == document?.Info?.Lang2})?.label, 
          read: glossaryArr[glossaryIndex].Lang1, 
          answer: glossaryArr[glossaryIndex].Lang2
        })
      } else{
        setGlossary({
          label1: languages.find(obj => {return obj.value == document?.Info?.Lang2})?.label, 
          label2: languages.find(obj => {return obj.value == document?.Info?.Lang1})?.label, 
          read: glossaryArr[glossaryIndex].Lang2, 
          answer: glossaryArr[glossaryIndex].Lang1
        })
      }
    }
  }

  function GuessWord(){
    if (input == glossary.answer){
      setGlossaryIndex(glossaryIndex + 1)
      setInput("")
      SetAlert({H: "Correct", p: "Great job!", class: "success"})
    }
    else if (compareTwoStrings(input, glossary.answer) > 0.9){
      setInput("")
      SetAlert({H: "Very Close", p: "Please try again!", class: "close"})
    }
    else if (compareTwoStrings(input, glossary.answer) > 0.75){
      setInput("")
      SetAlert({H: "Close", p: "Try again!", class: "close"})
    }
    else{
      setGlossaryIndex(glossaryIndex + 1)
      setInput("")
      SetAlert({H: "Wrong", p: `The word was ${glossary.answer}`, class: "failed"})
    }
  }

  useEffect(() => {
    if (glossaryIndex < glossaryArr.length){
      Setup()
    } else if (document && glossaryArr && glossaryArr.length > 0 && glossaryIndex >= glossaryArr.length){
      router.push(`/glossary/${id}`)
    }
  }, [glossaryIndex])

  function SetAlert(alertType){
    if (alert){
      setAlert(null)

      setTimeout(() => {
        setAlert(alertType)
      }, 50)
    } else{
      setAlert(alertType)
    }
  }

  function RevealLetter(){
    if (revealedLetters.length < glossary.answer.length)
      setRevealedLetters(revealedLetters + glossary.answer[revealedLetters.length])
  }

  useEffect(() => {
    setInput(revealedLetters)
  }, [revealedLetters])

  return (
    <>
      <Header />
      <div className={styles.centercontainer}>
        <div className={styles.wrapper} style={{width: "clamp(20rem, 30vw, 40rem)"}}>
          {alert && alert.H &&
          <motion.div className={`${styles.alert} ${styles[alert.class]}`} style={{top: matches ? "25vh" : "30vh"}} initial={{scale: "0"}} animate={{scale: "100%"}} exit={{scale: "0"}}>
            {alert.H == "Correct" ?
            <AiOutlineCheckCircle size={40} style={{marginRight: "1vw"}} />
            : <AiOutlineCloseCircle size={40} style={{marginRight: "1vw"}} />
            }
            <span>
              <h2>{alert.H}</h2>
              <p>{alert.p}</p>
            </span>
          </motion.div>
          }
          <Input.Wrapper className={styles.textinput} label={glossary.label1 || "Language 1"}>
            <Input readOnly value={glossary.read} size={matches ? "md" : "xs"}/>
          </Input.Wrapper>
          <Input.Wrapper className={styles.textinput} label={glossary.label2 || "Language 2"}>
            <Input value={input} placeholder="Translation" onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => {e.key === 'Enter' && GuessWord()}} size={matches ? "md" : "xs"} />
          </Input.Wrapper>
          <div className={styles.flexrow}>
            <Button onClick={() => GuessWord()} color="accent4">Answer</Button>
            <Button onClick={() => RevealLetter()} color="white">Reveal letter</Button>
          </div>
        </div>
      </div>
    </>
  )
}
