import React, { useEffect, useState } from 'react'
import { googleSignIn, useAuth, emailSignIn, emailSignUp } from '../../config/firebase/auth'
import { useRouter } from 'next/router'
import styles from '../../styles/popup.module.css'
import Popup from './Popup'
import {Input} from   '@mantine/core'
import {IconButton}  from '@mui/material'
import { FaAt, FaEye, FaEyeSlash, FaGoogle } from 'react-icons/fa'
import { Button } from '../Components'
import { useMediaQuery } from '@mantine/hooks'

export default function Login(props) {

  const [register, setRegister] = useState(false)

  const [input, setInput] = useState({Email: "", Password: "", First: "", Last: ""})
  const [error, setError] = useState({Email: "", Password: "", First: "", Last: ""})
  const [passwordVisible, setPasswordVisible] = useState(false)

  const user = useAuth()
  const router = useRouter()
  const matches = useMediaQuery('(min-width: 768px)')
  
  const handleGoogleSignIn = async () => {
    try{
      await googleSignIn() 
    }
    catch (error){
      console.log(error)
    }
  }

  const handleEmailSignin = async () => {
    var re = /\S+@\S+\.\S+/;
    if (!re.test(input.Email)) {setError({...error, Email: "Not a valid email adress"}); return}
    if (input.Password.length < 6) {setError({...error, Password: "Password must be at least 6 characters"}); return}

    const unsub = await emailSignIn(input.Email, input.Password)
    if (!unsub){ // Success

    } else{
      switch (unsub){
        case "Wrong password.": setError({...error, Password: unsub}); break
        default: setError({...error, Email: unsub, Password: " "})
      }
    }
  }

  const handleEmailSignUp = async () => {
    var re = /\S+@\S+\.\S+/;
    if (!re.test(input.Email)) {setError({...error, Email: "Not a valid email adress"}); return}
    if (input.Password.length < 6) {setError({...error, Password: "Password must contain at least 6 characters"}); return}
    if (input.First.length < 2) {setError({...error, First: "First name must contain at least 2 characters"}); return}
    if (input.Last.length < 2) {setError({...error, First: "First name must contain at least 2 characters"}); return}

    const unsub = await emailSignUp(input.First, input.Last, input.Email, input.Password)
    if (!unsub){ // Success

    } else{
      console.log(unsub)
      switch (unsub){
        case "Wrong password.": setError({...error, Password: unsub}); break
        default: setError({...error, Email: unsub, Password: " "})
      }
    }
  }

  useEffect(() => {
    if (user !== undefined && user !== null){
      if (props.open){
        props.setOpen(false)
        router.push('/dashboard')
      }
    }
  }, [user])

  useEffect(() => {
    if (props.type == "signup"){
      setRegister(true)
    } else{
      setRegister(false)
    }
  }, [props.type])

  return (
    <Popup props={props}>
      {register ?
      <div className={styles.innercontainer}>
        <h1 className={styles.h1}>Sign up</h1>
        <div className={styles.sideby}>
          <Input.Wrapper label="First Name" error={error.First}>
            <Input invalid={error.First.length > 0} value={input.First} onChange={(e) => setInput({...input, First: e.target.value})} type="text" name='first-name'/>
          </Input.Wrapper>
          <Input.Wrapper label="Last Name" error={error.Last}>
            <Input invalid={error.Last.length > 0} value={input.Last} onChange={(e) => setInput({...input, Last: e.target.value})} type="text" name='last-name'/>
          </Input.Wrapper>
        </div>
        <Input.Wrapper label="Email Adress" error={error.Email}>
          <Input invalid={error.Email.length > 0} value={input.Email} onChange={(e) => setInput({...input, Email: e.target.value})} rightSection={<FaAt size={15} color="#999"/>} type="email" name='email'/>
        </Input.Wrapper>
        <Input.Wrapper label="Password" error={error.Password}>
          <Input invalid={error.Password.length > 0} value={input.Password} onChange={(e) => setInput({...input, Password: e.target.value})} type={passwordVisible ? "text" : "password"} rightSection={<IconButton onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <FaEye size={15} color="#999"/> : <FaEyeSlash size={15} color="#999"/>}</IconButton>} name="password" />
        </Input.Wrapper>
        <div style={{alignSelf: "center", marginTop:"1vw"}}><Button onClick={() => handleEmailSignUp()}><pre>     Sign Up     </pre></Button></div>
        <div className={styles.changetype}>
          <p>Already have an account? </p><button onClick={() => setRegister(false)}>Log in instead</button>
        </div>
      </div> :
      <div className={styles.innercontainer}>
        <h1 className={styles.h1}>Log In</h1>
        <Input.Wrapper className={styles.textwrapper} label="Email Adress" error={error.Email}>
          <Input className={styles.textfield} invalid={error.Email.length > 0} value={input.Email} onChange={(e) => setInput({...input, Email: e.target.value})} rightSection={<FaAt size={15} color="#999"/>} type="email"/>
        </Input.Wrapper>
        <Input.Wrapper className={styles.textwrapper} label="Password" error={error.Password}>
          <Input className={styles.textfield} invalid={error.Password.length > 0} value={input.Password} onChange={(e) => setInput({...input, Password: e.target.value})} type={passwordVisible ? "text" : "password"} rightSection={<IconButton onClick={() => setPasswordVisible(!passwordVisible)}>{passwordVisible ? <FaEye size={15} color="#999"/> : <FaEyeSlash size={15} color="#999"/>}</IconButton>} />
        </Input.Wrapper>
        <div style={{alignSelf: "center", marginTop:"1vw"}}><Button onClick={() => handleEmailSignin()}><pre>     Sign In     </pre></Button></div>
        <div className={styles.divider}>
          <span></span>or<span></span>
        </div>
        <IconButton onClick={() => handleGoogleSignIn()} style={{width: "fit-content", alignSelf: "center"}}><FaGoogle size={25} /></IconButton>
        <div className={styles.changetype}>
          <p>Don't have an account? </p><button onClick={() => setRegister(true)}>Create new one</button>
        </div>
      </div>
      }
    </Popup>
  )
}
