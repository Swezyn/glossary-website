import React, { useEffect, useState } from 'react'
import styles from '../../styles/popup.module.css'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseFill } from 'react-icons/ri'
import { IconButton } from '@mui/material'

export default function Popup(props) {

    const [canClose, setCanClose] = useState(false)

    function TryClose(e){
        if (canClose){
            props.props.setOpen(false)
        }
        else{
            setCanClose(true)
        }
    }

    useEffect(() => {
        if (canClose){
            setTimeout(setCanClose, 1000, false)
        }
    }, [canClose])

  return (
    <>
        {/* <AnimatePresence initial={false} exitBeforeEnter={true}> */}
            {props.props.open && !props.loading &&
            <motion.div className={styles.container}  style={canClose && {backgroundColor: "#8b000020"}} onClick={(e) => TryClose(e)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0}}}>
                <motion.div className={styles.wrapper} onClick={(e) => e.stopPropagation()} initial={{y: "-100vh"}} animate={{y: "0", transition: {duration: 0.25, type: "spring", damping: 100, stiffness: 1000}}} exit={{y: "100vh"}}>
                    {/* <svg className={styles.shapes}><g><g transform="translate(650 380)"><path d="M0 -106.2L92 -53.1L92 53.1L0 106.2L-92 53.1L-92 -53.1Z"></path></g><g transform="translate(750 150)"><path d="M0 -78L67.5 -39L67.5 39L0 78L-67.5 39L-67.5 -39Z"></path></g></g></svg> */}
                    <svg className={styles.shapes} viewBox="0 0 612.001 612.001" xmlSpace="preserve"><g><g transform="translate(590 450)"><path d="M0 -26L20.3 -16.2L25.3 5.8L11.3 23.4L-11.3 23.4L-25.3 5.8L-20.3 -16.2Z"></path></g><g transform="translate(785 385)"><path d="M0 -50L39.1 -31.2L48.7 11.1L21.7 45L-21.7 45L-48.7 11.1L-39.1 -31.2Z"></path></g><g transform="translate(730 1)"><path d="M0 -45L35.2 -28.1L43.9 10L19.5 40.5L-19.5 40.5L-43.9 10L-35.2 -28.1Z"></path></g><g transform="translate(740 516)"><path d="M0 -61L47.7 -38L59.5 13.6L26.5 55L-26.5 55L-59.5 13.6L-47.7 -38Z"></path></g><g transform="translate(640 239)"><path d="M0 -15L11.7 -9.4L14.6 3.3L6.5 13.5L-6.5 13.5L-14.6 3.3L-11.7 -9.4Z"></path></g></g></svg>
                    <IconButton onClick={() => props.props.setOpen(false)} className={styles.xbutton} size='small'><RiCloseFill size={35} /></IconButton>
                    {props.children}
                </motion.div>
            </motion.div>
            }
        {/* </AnimatePresence> */}
        {/* <AnimatePresence initial={false} exitBeforeEnter={true}> */}
            {props.loading && props.props.open ?
            <motion.div className={styles.container} style={canClose && {backgroundColor: "#8b000020"}} onClick={(e) => TryClose(e)} initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0, transition: {duration: 0}}}>
                <motion.div className={styles.loadingwrapper} onClick={(e) => e.stopPropagation()} initial={{scale: "0"}} animate={{scale: "100%", transition: {duration: 0.25, type: "spring", damping: 100, stiffness: 1000}}} exit={{scale: "0"}}>
                   <motion.span className={styles.spinner} animate={{rotate: 360}} transition={{repeat: Infinity, ease: 'easeInOut', duration: 1}}/> 
                </motion.div> :
            </motion.div>
            : <motion.div className={styles.cornerloading}>
                
            </motion.div>
            }
        {/* </AnimatePresence> */}
    </>
  )
}
