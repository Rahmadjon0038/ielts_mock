// components/MonthCard.jsx
import React from 'react'
import { Container } from './style'

function MonthCard({ title, status }) {
  

  return (
    <Container status={status}>
      <h2>{title}</h2>
    </Container>
  )
}

export default MonthCard
