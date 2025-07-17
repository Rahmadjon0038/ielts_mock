'use client'
import React from 'react'
import { GlobalContainer } from '@/globalStyle'
import { useParams, useRouter } from 'next/navigation'
import { SectionCard, SectionList } from '../../style'
import { UserCard, UserList } from '@/components/Navbar/style'
import { usegetMontId } from '@/hooks/mockMonth'
import Loader from '@/components/loader/Loader'
import { useGetWritingAnswerMonthUsers } from '@/hooks/writing'
import NoResult from '@/components/NoResult'

const sections = [
  { id: 'listening', title: 'Listening' },
  { id: 'reading', title: 'Reading' },
  { id: 'writing', title: 'Writing' },
  { id: 'speaking', title: 'Speaking' }
]

function AdminResult() {
  const { id } = useParams()

  const { data, isLoading, error, refetch } = usegetMontId(id);
  const { data: userResults, isLoading: usersisLoading, error: userserror } = useGetWritingAnswerMonthUsers(id)//javob yuborgan userlar bu oy uchun
  const router = useRouter()

  const handleGo = (sectionId) => {
    console.log(sectionId)
    router.push(`/admin/mock/${id}/section/${sectionId}`)
  }

  const handleUserCheck = (userId) => {
    router.push(`/admin/mock/${id}/user/${userId}`)

  }
  if (isLoading) {
    return <Loader />
  }

  return (
    <GlobalContainer>
      <h2 style={{ marginBottom: '2rem' }}>Mock: {data?.month} uchun bo‘limlar</h2>

      <SectionList>
        {sections?.map((item) => (
          <SectionCard key={item.id}>
            <h3>{item?.title}</h3>
            <button onClick={() => handleGo(item.id)}>Bo‘limga o‘tish</button>
          </SectionCard>
        ))}
      </SectionList>
      <h3 style={{ margin: '2rem 0' }}>📊 Foydalanuvchilar natijalari</h3>
      <UserList>
        {userResults?.length ? userResults?.map((user) => (
          <UserCard key={user.id}>
            <div>
              <strong>{user.username}</strong><br />
            </div>
            <button onClick={() => handleUserCheck(user.id)}>Ko‘rish</button>
          </UserCard>
        ))
          : <NoResult message='natijalalar hali kelmagan' />
        }
      </UserList>


    </GlobalContainer>
  )
}

export default AdminResult
