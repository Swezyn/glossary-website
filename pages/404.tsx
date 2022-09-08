import React from 'react'
import { useRouter } from 'next/router'
import { Button } from '../components/Components'
import styles from '../styles/page.module.css'
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function NotFound() {

    const router = useRouter()
    
  return (
    <div className={styles.container} style={{display: "flex", justifyContent: "center", alignItems:"center", flexDirection: "column"}}>
        <div style={{position: "absolute", fontSize:"75vh", fontWeight:"bold", opacity:"0.05", zIndex:"-1"}}>404</div>
        <h1 style={{lineHeight: "2"}}>Nothing to see here</h1>
        <p style={{width: "clamp(350px, 40vw, 1600px)", textAlign:"center"}}>The page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL.</p>
        <div style={{height: "5vh"}}/>
        <Button onClick={() => router.push('/')}>Take me back to home page</Button>
    </div>
  )
}
