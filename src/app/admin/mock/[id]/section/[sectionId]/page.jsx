'use client'
import { GlobalContainer } from '@/globalStyle'
import { useParams } from 'next/navigation'
import React from 'react'

function page() {
  const {sectionId} = useParams()
  return (
    <GlobalContainer>{sectionId} yaxshi</GlobalContainer>
  )
}

export default page