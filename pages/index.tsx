import React from 'react'
import styles from '../styles/page.module.css'
import { useAuth } from '../config/firebase/auth'
import { useEffect } from 'react'
import {useRouter} from 'next/router'
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/Components'
import {motion} from 'framer-motion'

export default function Home() {

  const user = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [])

  return (
    <>
      <Header />
      <div className={styles.centercontainer}>
        <div className={styles.heading}>
          <motion.h1 initial={{scale: "75%"}} animate={{scale: "100%"}}>Ace your tests</motion.h1>
          <motion.p initial={{scale: "75%"}} animate={{scale: "100%"}} transition={{delay: 0.1}}>The best way to stay organized, keep track and practise.</motion.p>
          <div className={styles.flexcenter}>
            <motion.div initial={{scale: "75%"}} animate={{scale: "100%"}} transition={{delay: 0.2}}><Button color="white" style={{border: "2px solid var(--accent2)"}}>Browse glossarys</Button></motion.div>
            <motion.div initial={{scale: "75%"}} animate={{scale: "100%"}} transition={{delay: 0.3}}><Button color="accent2">Sign Up</Button></motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}