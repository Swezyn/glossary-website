import React from 'react'
import styles from '../styles/footer.module.css'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className={styles.container}>
        <h2 className={styles.logo}>Aschoo</h2>
        <nav>
          <ul className={styles.nav}>
            <li><Link href='/'><a>Contact</a></Link></li>
            <li><Link href='/'><a>Privacy</a></Link></li>
            <li><Link href='/'><a>Changelog</a></Link></li>
          </ul>
        </nav>
    </div>
  )
}
