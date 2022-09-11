import React, { useState } from 'react'
import styles from '../styles/sidebar.module.css'
import { Tooltip, Avatar } from '@mantine/core'
import { MdOutlineDashboard } from 'react-icons/md'
import { VscWholeWord } from 'react-icons/vsc'
import { BsCheck2Square } from 'react-icons/bs'
import { GoThreeBars } from 'react-icons/go'
import {motion} from 'framer-motion'
import { useAuth } from '../config/firebase/auth'
import { useRouter } from 'next/router'

export default function Sidebar(props) {

    const user = useAuth()
    const router = useRouter()

    const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className={styles.container} style={{width: sidebarOpen ? "300px" : "76px"}}>
        <div className={styles.buttons}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}><GoThreeBars />{sidebarOpen ? <h2>Close Sidebar</h2> : <span>Open Sidebar</span>}</button>
            <button className={props.active == "dashboard" ? styles.active : ""} onClick={() => router.push("/dashboard")}><MdOutlineDashboard />{sidebarOpen ? <h2>Dashboard</h2> : <span>Dashboard</span>}</button>
            <button className={props.active == "glossary" ? styles.active : ""} onClick={() => router.push("/dashboard/glossary")}><VscWholeWord />{sidebarOpen ? <h2>Glossarys</h2> : <span>Glossarys</span>}</button>
            <button className={props.active == "tasks" ? styles.active : ""} onClick={() => router.push("/dashboard/tasks")}><BsCheck2Square />{sidebarOpen ? <h2>Tasks</h2> : <span>Tasks</span>}</button>
        </div>
    </div>
  )
}
