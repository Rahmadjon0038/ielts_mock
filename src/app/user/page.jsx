'use client'
import React from 'react'
import MonthCard from '@/components/users/mookcard/MonthCard'
import { GlobalContainer } from '@/globalStyle'
import styled from 'styled-components'
import Link from 'next/link'
import BannerComponent from '@/components/banner/Banner'
import { useGetAllUsersRatingsMonth } from '@/hooks/writing'
import Loader from '@/components/loader/Loader'
import { useAuth } from '@/context/userData'
import NoResult from '@/components/NoResult'
import { Title } from './results/[id]/style'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`

function UserProfile() {
  const { user } = useAuth();
  const { data, isLoading, error } = useGetAllUsersRatingsMonth(user?.user.id)
  // console.log(data)
  const formatMonth = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  if (isLoading) {
    return <Loader />
  }


  return (
    <GlobalContainer>
      <BannerComponent info={'Bu bo‘limda siz IELTS Mock testidagi natijalaringizni kuzatishingiz mumkin.'} />
      <Title className=''>Siz qatnashgan ielst testlari</Title>
      {error ? <NoResult message='siz yechgan testlar mavjud emas yiki admin hali baxolamagan' />
        :
        < Grid >
          {data?.map((monthItem) => (
            <Link key={monthItem.id} href={`/user/results/${monthItem.id}`}>
              <MonthCard
                title={formatMonth(monthItem.month)}
              />
            </Link>
          ))}
        </Grid>
      }
    </GlobalContainer >
  )
}

export default UserProfile
