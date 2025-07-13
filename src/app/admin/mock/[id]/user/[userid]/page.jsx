'use client'
import { GlobalContainer } from '@/globalStyle'
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
  const data  = useParams()
  console.log(data)
  return (
    <GlobalContainer>
      yaxshi userid : {data.userid}
    </GlobalContainer>
  )
}

export default page