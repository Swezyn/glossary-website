import React, { useState } from 'react'
import styles from '.././styles/components.module.css'

export function Button(props) {

  return (
    <button disabled={props.disabled} style={props.style} onClick={(e) => props.onClick && props.onClick(e)} className={`${styles.button} ${styles[props.color]}`}>{props.children}</button>
  )
}
