import React, { useEffect, useState } from 'react'
import { ReadCollectionSnapshot } from '../../config/firebase/storage'
import styles from '../../styles/page.module.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function Glossary() {

    const collection = ReadCollectionSnapshot("glossarys")
    console.log(collection)

  return (
    <>
      <Header />
      <div className={styles.container}>
          Glossary
          {collection.map((doc) => 
          <div className={styles.glossary}>
              <a href={`/glossary/${doc?.id}`}>{doc?.Info.Name} by {doc?.Info.Creator}</a>
          </div>)}
      </div>
      <Footer />
    </>
  )
}
