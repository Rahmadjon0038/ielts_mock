'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { GlobalContainer } from '@/globalStyle'
import { SectionCard, Title, SectionsWrapper } from './style'
import { useGetAllusersRatings } from '@/hooks/writing'
import { useAuth } from '@/context/userData'
import Loader from '@/components/loader/Loader'
import NoResult from '@/components/NoResult'

function MonthResultPage() {
  const { user } = useAuth()
  const { id } = useParams()

  const { data, isLoading, error } = useGetAllusersRatings({
    monthId: id,
    userId: user?.user?.id,
  })

  if (isLoading) return <Loader />
  if (error || !data) return <NoResult message='Ma’lumot topilmadi' />

  return (
    <GlobalContainer>
      <Title>Mock natijalari</Title>

      <SectionsWrapper>
        {data.map((section, index) => (
          <SectionCard key={index} status={section.score !== null}>
            <h3>{section.section}</h3>
            <p>
              Ball:{''}
              {section.score !== null ? (
                <strong>{section.score}</strong>
              ) : (
                <em>Tekshirilmoqda...</em>
              )}
            </p>
            {section.comment && (
              <p>
                <strong>Izoh:</strong> {section.comment}
              </p>
            )}
          </SectionCard>
        ))}
      </SectionsWrapper>
    </GlobalContainer>
  )
}

export default MonthResultPage
