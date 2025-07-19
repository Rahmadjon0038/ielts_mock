'use client'
import Readingpage from '@/components/reading/Readingpage'
import { GlobalContainer } from '@/globalStyle'
import React from 'react'

function Reading() {
  return (
    <GlobalContainer full='full'>
      <Readingpage />
    </GlobalContainer>
  )
}

export default Reading