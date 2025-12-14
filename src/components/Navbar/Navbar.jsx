'use client'
import React from 'react'
import { Buttons, Logocont, NavbarConatiner, Profile } from './style'
import logo from '../../assets/logo.png'
import Image from 'next/image'
import Link from 'next/link'
import Login from '../auth/login/Login'
import Register from '../auth/register/Register'
import { useAuth } from '@/context/userData'
import Loader from '../loader/Loader'
import { useRouter } from 'next/navigation'
import { FaRegUserCircle } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
function Navbar() {
    const { user, setUser, isLoading } = useAuth();
    const role = user?.user?.role
    const router = useRouter();
    if (isLoading) {
        return <Loader />
    }
    return (
        <NavbarConatiner>
            <Link href={'/'}>
                <Logocont>
                    {/* <Image width={100} className='logoimg' src={logo} alt='logo'/> */}
                    <div>
                        <h2>IELTS Gauge</h2>
                        {/* <h3>Taraqqiyot</h3> */}
                        {/* <p>Teaching center</p> */}
                    </div>
                </Logocont>
            </Link>
            {role == 'user' ? < Profile onClick={() => router.push('/user')}><FaRegUserCircle className='icon' /> {user?.user?.username}<MdKeyboardArrowDown /></Profile> : role == 'admin' ? < Profile onClick={() => router.push('/admin')}><FaRegUserCircle className='icon' /> {user?.user?.username}<MdKeyboardArrowDown /></Profile> :
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