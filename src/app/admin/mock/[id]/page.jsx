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
import { usegetAdminStast } from '@/hooks/adminStast'
import Wave from 'react-wavify'
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
  console.log(userResults)
  // ----------------------- admin stast ---------------
  const { data: stast, isLoading: stastLoading, err: stastError, refetch: refetchStats } = usegetAdminStast({ id })

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
    <div style={{minHeight:'100vh'}}>
      <GlobalContainer>
        <h2 style={{ marginBottom: '2rem' }}>Mock Sections for{data?.month}</h2>

        <SectionList>
          {sections?.map((item) => (
            <SectionCard key={item.id}>
              <h3>{item?.title}</h3>
              <button onClick={() => handleGo(item.id)}>Go to section</button>
            </SectionCard>
          ))}
        </SectionList>
        <h3 style={{ margin: '2rem 0' }}>📊 User results</h3>
        <UserList>
          {userResults?.length ? userResults?.map((user) => {
            const ratedData = stast?.find((item) => item.user_id === user.id);
            const ratedCount = ratedData?.rated_sections || 0;
            return (
              <UserCard key={user.id}>
                {/* Wave Background */}
                <div className="wave-bg">
                  <Wave className='wawe'
                    fill="#34d399"
                    paused={false}
                    options={{
                      // 4 = height 1,    3 = 20  2  = 40 1 = 80 0 = 100
                      height: ratedCount == 4 ? 1 : ratedCount == 3 ? 20 : ratedCount == 2 ? 40 : ratedCount == 1 ? 80 : 100,
                      amplitude: 20,
                      speed: 0.2,
                      points: 5
                    }}
                  />
                </div>
                <strong>{user.username}</strong>
                <p>4/{ratedCount}</p>
                <button onClick={() => handleUserCheck(user.id)}>View</button>
              </UserCard>
            );
          }) : (
            <NoResult message='The results are not yet available.' />
          )}
        </UserList>
      </GlobalContainer>
    </div>
  )
}

export default AdminResult
