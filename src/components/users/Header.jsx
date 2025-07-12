'use client'
import React from 'react'
import { Banner, Container, Title, Subtitle } from './style'
import { useAuth } from '@/context/userData'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { usegetUser } from '@/hooks/user'

function UserHeader() {
  const { user } = useAuth()
  const { refetch } = usegetUser();
  const router = useRouter();
  const data = user?.user
  const logOut = () => {
    Cookies.remove('token');
    refetch();
    router.push('/');
  }
  return (
    <Container>
      <Banner>
        <Title>Salom, {data?.username}!</Title>
        <Subtitle>
          Bu bo‘limda siz ILST Mook testidagi natijalaringizni kuzatishingiz mumkin.
        </Subtitle>
        <p>Email: {data?.email}</p>

        <button onClick={logOut}>Logout</button>
      </Banner>
    </Container>
  )
}

export default UserHeader
