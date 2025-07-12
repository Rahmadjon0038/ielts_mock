'use client'
import React from 'react'
import { Buttons, Logo, NavbarConatiner } from './style'
import logo from '../../assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import Login from '../auth/login/Login'
import Register from '../auth/register/Register'
import { useAuth } from '@/context/userData'
function Navbar({ role }) {
    const { user, setUser } = useAuth();
    console.log(role)
    return (
        <NavbarConatiner>
            <Link href={'/'}>
                <Logo>
                    <Image width={100} className='logoimg' src={logo} alt='img' />
                    <div>
                        <h3>Taraqqiyot</h3>
                        <p>Teaching center</p>
                    </div>
                </Logo>
            </Link>
            {role == 'user' ? < button > user Proflie</button> : role == 'admin' ? <button>admin profile</button> :
                <Buttons>
                    <Login>
                        Log in
                    </Login>
                    <Register>
                        Register
                    </Register>
                </Buttons>
            }
        </NavbarConatiner >
    )
}

export default Navbar