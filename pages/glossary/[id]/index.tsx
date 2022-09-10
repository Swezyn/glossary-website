import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import EditGlossary from '../../../components/Popups/EditGlossary'
import AddGlossary from '../../../components/Popups/AddGlossary'
import { useAuth } from '../../../config/firebase/auth'
import { db } from '../../../config/firebase/firebase'
import { arrayUnion, doc, onSnapshot, deleteField, updateDoc, arrayRemove } from "firebase/firestore";
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import languages from '../../../public/languages.json'
import { MdOutlineKeyboardArrowRight, MdModeEdit } from 'react-icons/md'
import { GoPlus, GoTrashcan } from 'react-icons/go'
import styles from '../../../styles/page.module.css'
import { UpdateDocument } from '../../../config/firebase/storage'
import Link from 'next/link'

export default function Glossary() {

  const user = useAuth()

  const [editGlossaryOpen, setEditGlossaryOpen] = useState(false)
  const [addGlossaryOpen, setAddGlossaryOpen] = useState(false)
  const [glossary, setGlossary] = useState(null)

  const router = useRouter()
  const id : string = router.query.id as string

  useEffect(() => {
    if (!id) return
    return onSnapshot(doc(db, "glossarys", id), (doc) => {
      setGlossary({...doc.data(), id: doc.id})
    });
  }, [id])

  useEffect(() => {
    if (user && user.uid == glossary?.Info?.Creator && glossary && (!glossary.Info.Lang1 || !glossary.Info.Lang2)){
      setEditGlossaryOpen(true)
    }
    else if (user && user.uid == glossary?.Info?.Creator && glossary && !glossary.Glossary){
      setAddGlossaryOpen(true)
    }
  }, [glossary, editGlossaryOpen, addGlossaryOpen])

  function Practise(query){
    router.push({
      pathname: `/glossary/${id}/practise`,
      query: query
    })
  }

  async function RemoveGlossary(index){
    const docRef = doc(db, "glossarys", glossary.id)
    
    try{
      await updateDoc(docRef, {
        Glossary: arrayRemove(glossary.Glossary[index])
      })
    } catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container} >
        {glossary && glossary?.Info ? <>
          <h1>{glossary?.Info?.Name}</h1>
          <div className={styles.flexrow}>
            <div className={styles.buttonbox}>
              <h2>Practise Words</h2>
              <div className={styles.flexcenter}>
                <button onClick={() => Practise({type: 'words', lang: '1-2'})}>{glossary.Info.Lang1?.toUpperCase()}<MdOutlineKeyboardArrowRight />{glossary.Info.Lang2?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'words', lang: '2-1'})}>{glossary.Info.Lang2?.toUpperCase()}<MdOutlineKeyboardArrowRight />{glossary.Info.Lang1?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'words', lang: 'mixed'})}>Mixed</button>
              </div>
            </div>
            <div className={styles.buttonbox}>
              <h2>Practise Spelling</h2>
              <div className={styles.flexcenter}>
                <button onClick={() => Practise({type: 'spelling', lang: '1-2'})}>{glossary.Info.Lang1?.toUpperCase()}<MdOutlineKeyboardArrowRight />{glossary.Info.Lang2?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'spelling', lang: '2-1'})}>{glossary.Info.Lang2?.toUpperCase()}<MdOutlineKeyboardArrowRight />{glossary.Info.Lang1?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'spelling', lang: 'mixed'})}>Mixed</button>
              </div>
            </div>
            {user && user.uid == glossary.Info.Creator &&
          <>
              <button className={styles.buttonbox} style={{cursor: "pointer"}} onClick={() => setAddGlossaryOpen(true)}><GoPlus size={50} /></button>
              <button className={styles.buttonbox} style={{cursor: "pointer"}} onClick={() => setEditGlossaryOpen(true)}><MdModeEdit size={50} /></button>
              <EditGlossary open={editGlossaryOpen} setOpen={setEditGlossaryOpen} doc={glossary} />
              <AddGlossary open={addGlossaryOpen} setOpen={setAddGlossaryOpen} doc={glossary}/>
          </>
          }
          </div>
          <div className={styles.verticallist}>
              <h2>Recent glossarys</h2>
              <div style={{display: "flex"}}>
                <h3 style={{width: "45%"}}>{languages.find(obj => {return obj.value == glossary.Info.Lang1})?.label}</h3>
                <h3 style={{width: "45%"}}>{languages.find(obj => {return obj.value == glossary.Info.Lang2})?.label}</h3>
              </div>
              <ul>
                {glossary?.Glossary?.length > 0 ? glossary.Glossary.map((glossary, i) => {
                  return <Link href={`/glossary/${glossary.id}`}><a><li key={glossary.id}><p style={{width: "50%"}}>{glossary.Lang1}</p><p style={{width: "45%"}}>{glossary.Lang2}</p><button onClick={() => RemoveGlossary(i)} className={styles.garbagebutton}><GoTrashcan /></button></li></a></Link>
                }) : <><li><div className={styles.skeleton} /></li><li><div className={styles.skeleton} /></li><li><div className={styles.skeleton} /></li></>}
              </ul>
            </div>
          </> :
          <>
              
          </>
        }
      </div>
      <Footer />
    </>
  )
}
