'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { GlobalContainer } from '@/globalStyle'
import { SectionCard, Title, SectionsWrapper } from './style' // styled faylimizni import qilyapmiz

const mockResults = [
  {
    id: 1,
    month: 'January 2025',
    sections: [
      { name: 'Reading', score: 7.5 },
      { name: 'Listening', score: 8.0 },
      { name: 'Writing', score: null },
      { name: 'Speaking', score: null },
    ],
  },
  {
    id: 2,
    month: 'February 2025',
    sections: [
      { name: 'Reading', score: 6.5 },
      { name: 'Listening', score: 7.0 },
      { name: 'Writing', score: 5.5 },
      { name: 'Speaking', score: 6.0 },
    ],
  },
]

function MonthResultPage() {
  const { id } = useParams()
  const monthData = mockResults.find((item) => item.id === Number(id))

  if (!monthData) return <GlobalContainer>Natija topilmadi</GlobalContainer>

  return (
    <GlobalContainer>
      <Title>{monthData.month} uchun natijalar</Title>
      <SectionsWrapper>
        {monthData.sections.map((section, index) => (
          <SectionCard key={index} status={section.score !== null}>
            <h3>{section.name}</h3>
            <p>
              Ball:{" "}
              {section.score !== null ? section.score : <em>Coming soon...</em>}
            </p>
          </SectionCard>
        ))}
      </SectionsWrapper>
    </GlobalContainer>
  )
}

export default MonthResultPage
