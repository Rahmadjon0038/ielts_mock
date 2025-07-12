// components/MonthCard.jsx
import React from 'react'
import { Container } from './style'

function MonthCard({ title, status }) {
  const getStatusText = () => {
    if (status === 'completed') return '✅ Yechilgan'
    if (status === 'submitted') return '⏳ Tekshirilmoqda'
    return '❌ Yechilmagan'
  }

  return (
    <Container status={status}>
      <h2>{title}</h2>
      <p>{getStatusText()}</p>
    </Container>
  )
}

export default MonthCard
