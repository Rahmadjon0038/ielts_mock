'use client'
import React from 'react'
import Header from '@/components/users/Header'
import MonthCard from '@/components/users/mookcard/MonthCard'
import { GlobalContainer } from '@/globalStyle'
import styled from 'styled-components'
import Link from 'next/link'

// Oylik mock testlar — backenddan keladi (hozircha local array)
const months = [
  { id: 1, title: 'January 2025', status: 'completed' },
  { id: 2, title: 'February 2025', status: 'submitted' },
  { id: 3, title: 'March 2025', status: 'incomplete' },
  { id: 4, title: 'April 2025', status: 'completed' },
  { id: 5, title: 'May 2025', status: 'incomplete' },
]

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
`
function UserProfile() {
  return (
    <GlobalContainer>
      <Header />
      <Grid>
        {months.map((month, index) => (
          <Link key={month.id} href={`/user/results/${month.id}`}>
            <MonthCard
              key={index}
              title={month.title}
              status={month.status}
            />
          </Link>
        ))}
      </Grid>
    </GlobalContainer>
  )
}

export default UserProfile
