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

export default function Glossary() {

  const user = useAuth()

  const [editGlossaryOpen, setEditGlossaryOpen] = useState(false)
  const [addGlossaryOpen, setAddGlossaryOpen] = useState(false)
  const [document, setDoc] = useState(null)

  const router = useRouter()
  const id : string = router.query.id as string

  useEffect(() => {
    if (!id) return
    return onSnapshot(doc(db, "glossarys", id), (doc) => {
      setDoc({...doc.data(), id: doc.id})
    });
  }, [id])

  useEffect(() => {
    if (user && user.uid == document.Info.Creator && document && (!document.Info.Lang1 || !document.Info.Lang2)){
      setEditGlossaryOpen(true)
    }
    else if (user && user.uid == document.Info.Creator && document && !document.Glossary){
      setAddGlossaryOpen(true)
    }
  }, [document, editGlossaryOpen, addGlossaryOpen])

  function Practise(query){
    router.push({
      pathname: `/glossary/${id}/practise`,
      query: query
    })
  }

  async function RemoveGlossary(index){
    const docRef = doc(db, "glossarys", document.id)
    
    try{
      await updateDoc(docRef, {
        Glossary: arrayRemove(document.Glossary[index])
      })
    } catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.container} >
        {document ? <>
          <h1>{document?.Info.Name}</h1>
          <div className={styles.flexrow}>
            <div className={styles.buttonbox}>
              <h2>Practise Words</h2>
              <div className={styles.flexcenter}>
                <button onClick={() => Practise({type: 'words', lang: '1-2'})}>{document.Info.Lang1?.toUpperCase()}<MdOutlineKeyboardArrowRight />{document.Info.Lang2?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'words', lang: '2-1'})}>{document.Info.Lang2?.toUpperCase()}<MdOutlineKeyboardArrowRight />{document.Info.Lang1?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'words', lang: 'mixed'})}>Mixed</button>
              </div>
            </div>
            <div className={styles.buttonbox}>
              <h2>Practise Spelling</h2>
              <div className={styles.flexcenter}>
                <button onClick={() => Practise({type: 'spelling', lang: '1-2'})}>{document.Info.Lang1?.toUpperCase()}<MdOutlineKeyboardArrowRight />{document.Info.Lang2?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'spelling', lang: '2-1'})}>{document.Info.Lang2?.toUpperCase()}<MdOutlineKeyboardArrowRight />{document.Info.Lang1?.toUpperCase()}</button>
                <button onClick={() => Practise({type: 'spelling', lang: 'mixed'})}>Mixed</button>
              </div>
            </div>
            {user && user.uid == document.Info.Creator &&
          <>
              <button className={styles.buttonbox} style={{cursor: "pointer"}} onClick={() => setAddGlossaryOpen(true)}><GoPlus size={50} /></button>
              <button className={styles.buttonbox} style={{cursor: "pointer"}} onClick={() => setEditGlossaryOpen(true)}><MdModeEdit size={50} /></button>
              <EditGlossary open={editGlossaryOpen} setOpen={setEditGlossaryOpen} doc={document} />
              <AddGlossary open={addGlossaryOpen} setOpen={setAddGlossaryOpen} doc={document}/>
          </>
          }
          </div>
          <div className={styles.glossarys}>
            <h2>Word list</h2>
            <div className={styles.glossarysh3}>
              <h3>{languages.find(obj => {return obj.value == document.Info.Lang1})?.label}</h3>
              <h3>{languages.find(obj => {return obj.value == document.Info.Lang2})?.label}</h3>
            </div>
            {document?.Glossary?.map((doc, i) => {
                return <div key={i} className={styles.glossary}><p>{doc.Lang1}</p> <p>{doc.Lang2}</p>{user && user.uid == document.Info.Creator && <button onClick={() => RemoveGlossary(i)} className={styles.garbagebutton}><GoTrashcan /></button>}</div>
            })}
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
