'use client'
import Loader from '@/components/loader/Loader'
import { GlobalContainer } from '@/globalStyle'
import { useGetWritingAnswerMonthAdmin } from '@/hooks/writing'
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
  const paramdata = useParams()
  const { data, isLoading, error, refetch } = useGetWritingAnswerMonthAdmin({ monthid: paramdata?.id, userid: paramdata?.userid })


  if (isLoading) {
    return <Loader />
  }

  return (
    <GlobalContainer>
      {data && data?.map((item) => (
        <div key={item.id}>
          <h1>{item.section}</h1>
          <p>task1:{item.task1}</p>
          <p>task1:{item.task2}</p>
        </div>
      ))}
    </GlobalContainer>
  )
}

export default page