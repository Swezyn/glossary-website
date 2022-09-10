import React, {useEffect, useState} from 'react'
import styles from '../styles/header.module.css'
import { Burger, Group, Avatar, Menu, Input } from '@mantine/core'
import { useAuth } from '../config/firebase/auth'
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import { logOut } from '../config/firebase/auth'
import Login from './Popups/Login'
import { useMediaQuery } from '@mantine/hooks'
import Link from 'next/link'
import { useRouter } from 'next/router'

function getWindowDimensions() {
  if (typeof window !== 'undefined'){
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height
    };
  }
}

export default function Header() {

  const user = useAuth() || null
  const router = useRouter()

  const burger = useMediaQuery('(max-width: 768px)')
    const [burgerOpen, setBurgerOpen] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)
    const [logOrSign, setLogOrSign] = useState("login")
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const [searchInput, setSearchInput] = useState<string>("")

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
      function handleResize() {
        setWindowDimensions(getWindowDimensions());
      }
  
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    function Search(){
      console.log(searchInput)
      router.push({
        pathname: '/search',
        query: {Input: searchInput}
      })
    }

  return (
    <>
      <div style={{height: "var(--header-height)"}} />
      <Login open={loginOpen} setOpen={setLoginOpen} type={logOrSign} />
      <header className={styles.container}>
        <Link href="/"><a className={styles.logo}>Aschoo</a></Link>

        {!burger ?
        <>
          <Input className={styles.searchbar} type="text" placeholder='Enter glossary name' variant='filled' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} icon={<FaSearch />} onKeyDown={(e) => {if (e.key === 'Enter'){Search()}}}/>
          {userMenuOpen && user !== undefined && user !== null && <button onClick={() => setUserMenuOpen(false)} className={styles.outsidemask}></button>}
          {user ?
          <Menu width={300} position="bottom" transition="pop" opened={userMenuOpen}>
            <Menu.Target>
              <button className={`${styles.usermenubutton} ${userMenuOpen && styles.active}`} onClick={() => setUserMenuOpen(!userMenuOpen)}>
                  <Avatar size={35} src='' alt='User Image' radius='xl' color="blue">{user?.displayName[0]}</Avatar>
                  <p>{user?.displayName}</p>
                  <FaChevronDown size={12}/>
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Links</Menu.Label>
              <Menu.Item onClick={() => {setUserMenuOpen(false); router.push("/dashboard")}}>Dashboard</Menu.Item>
              <Menu.Label>Settings</Menu.Label>
              <Menu.Item onClick={() => {setUserMenuOpen(false);}}>Account settings</Menu.Item>
              <Menu.Item style={{backgroundColor: "var(--accent1)", color: "white"}} onClick={() => {setUserMenuOpen(false);logOut()}}>Logout</Menu.Item>
            </Menu.Dropdown>
          </Menu> :
          <Group spacing={15}>
              <button className={styles.accentbutton} onClick={() => {setLoginOpen(true); setLogOrSign("signup")}}>Sign up</button>
              <button className={styles.whitebutton} onClick={() => {setLoginOpen(true); setLogOrSign("login")}}>Log In</button>
          </Group>
          }
        </>
        : <>
            <Menu width={windowDimensions.width} position="bottom" transition="pop-top-right" opened={burgerOpen}>
              <Menu.Target>
                <Burger opened={burgerOpen} onClick={() => setBurgerOpen(!burgerOpen)} />
              </Menu.Target>
              <Menu.Dropdown>
                {user ? <>
                  <Menu.Item><Input style={{width: "100%"}} className={styles.searchbar} type="text" placeholder='Enter glossary name' variant='filled' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} icon={<FaSearch />} onKeyDown={(e) => {if (e.key === 'Enter'){Search()}}}/></Menu.Item>
                  <Menu.Label>Links</Menu.Label>
                  <Menu.Item onClick={() => {setUserMenuOpen(false); router.push("/dashboard")}}>Dashboard</Menu.Item>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item onClick={() => {setBurgerOpen(false);}}>Account settings</Menu.Item>
                  <Menu.Item style={{backgroundColor: "var(--accent1)", color: "white"}} onClick={() => {setBurgerOpen(false);logOut()}}>Logout</Menu.Item>
                </> :
                <>
                  <Menu.Item><Input style={{width: "100%"}} className={styles.searchbar} type="text" placeholder='Enter glossary name' variant='filled' value={searchInput} onChange={(e) => setSearchInput(e.target.value)} icon={<FaSearch />} onKeyDown={(e) => {if (e.key === 'Enter'){Search()}}}/></Menu.Item>
                  <Menu.Label>Links</Menu.Label>
                <Menu.Item onClick={() => {setUserMenuOpen(false); router.push("/dashboard")}}>Dashboard</Menu.Item>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item style={{backgroundColor: "var(--accent4)", color: "white"}} onClick={() => {setBurgerOpen(false);setLoginOpen(true);setLogOrSign("signup")}}>Sign up</Menu.Item>
                  <Menu.Item onClick={() => {setBurgerOpen(false);setLoginOpen(true);setLogOrSign("login")}}>Log in</Menu.Item>
                </>
                }
                </Menu.Dropdown>
            </Menu>
          </>
        }
      </header>
    </>
  )
}
