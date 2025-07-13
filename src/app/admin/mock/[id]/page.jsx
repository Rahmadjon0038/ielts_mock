'use client'

import React from 'react'
import { GlobalContainer } from '@/globalStyle'
import { useParams, useRouter } from 'next/navigation'
import { SectionCard, SectionList } from '../../style'
import { UserCard, UserList } from '@/components/Navbar/style'

const sections = [
  { id: 'listening', title: 'Listening' },
  { id: 'reading', title: 'Reading' },
  { id: 'writing', title: 'Writing' },
  { id: 'speaking', title: 'Speaking' }
]

const userResults = [
  {
    id: '1',
    name: 'Ali Valiyev',
    submitted: ['reading', 'writing', 'speaking']
  },
  {
    id: '2',
    name: 'Diyor Rajabov',
    submitted: ['reading', 'writing', 'speaking', 'listening']
  }
]

function AdminResult() {
  const { id } = useParams()
  const router = useRouter()

  const handleGo = (sectionId) => {
    router.push(`/admin/mock/${id}/section/${sectionId}`)
  }

  const handleUserCheck = (userId) => {
    router.push(`/admin/mock/${id}/user/${userId}`)

  }

  return (
    <GlobalContainer>
      <h2 style={{ marginBottom: '2rem' }}>Mock: {id} uchun bo‘limlar</h2>

      <SectionList>
        {sections.map((item) => (
          <SectionCard key={item.id}>
            <h3>{item.title}</h3>
            <button onClick={() => handleGo(item.id)}>Bo‘limga o‘tish</button>
          </SectionCard>
        ))}
      </SectionList>

      <h3 style={{ marginTop: '3rem' }}>📊 Foydalanuvchilar natijalari</h3>
      <UserList>
        {userResults.map((user) => (
          <UserCard key={user.id}>
            <div>
              <strong>{user.name}</strong><br />
              {user.submitted.length}/4 topshirgan
            </div>
            <button onClick={() => handleUserCheck(user.id)}>Ko‘rish</button>
          </UserCard>
        ))}
      </UserList>
    </GlobalContainer>
  )
}

export default AdminResult
