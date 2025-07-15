'use client'
import React from 'react'
import { Banner, Container, Title, Subtitle, LogOut } from './style'
import { useAuth } from '@/context/userData'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

function BannerComponent({ info } = 'sa') {
  const { user, setUser } = useAuth()
  const router = useRouter();
  const data = user?.user
  const logOut = () => {
    Cookies.remove('token');
    setUser(null)
    // window.location.reload(); //
    router.push('/');
  }
  return (
    <Container>
      <Banner>
        <Title>Salom, {data?.username}!</Title>
        <Subtitle>
          {info}
        </Subtitle>
        <p>Email: {data?.email}</p>
        <LogOut onClick={logOut}>Logout</LogOut>
      </Banner>
    </Container>
  )
}

export default BannerComponent
