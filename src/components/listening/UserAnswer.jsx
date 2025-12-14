'use client'
import { useGetListeningAnswers } from '@/hooks/listening'
import { useParams } from 'next/navigation'
import React from 'react'
import {
  AnswerContent,
  AnswerLabel,
  AnswerSection,
  HeaderSection,
  MainContainer,
  OptionItem,
  OptionsList,
  QuestionCard,
  QuestionDisplay,
  QuestionNumber,
  QuestionText,
  StatusMessage,
  Subtitle,
  Title,
} from './style'

function UserAnswer() {
  const { id: monthId, userid: userId } = useParams()
  const { data, isLoading, error } = useGetListeningAnswers({ monthId, userId })

  const parseAnswers = (answers) => {
    return answers.map((answer) => ({
      ...answer,
      parsedUserAnswers: Array.isArray(answer.useranswers)
        ? answer.useranswers
        : answer.useranswers ? JSON.parse(answer.useranswers) : [],
    }))
  }

  if (isLoading) {
    return <StatusMessage>Foydalanuvchi javoblari yuklanmoqda...</StatusMessage>
  }

  if (error) {
    return (
      <StatusMessage style={{ color: '#e74c3c' }}>
        Xatolik: Foydalanuvchi javoblarini yuklab bo'lmadi. Iltimos, keyinroq urinib ko'ring.
      </StatusMessage>
    )
  }

  const answers = data?.answers ? parseAnswers(data.answers) : []

  // YANGILANGAN renderTextQuestion – sizning ma'lumotlaringizga to'liq moslashtirilgan
  const renderTextQuestion = (question) => {
    if (!question.questiontext || typeof question.questiontext !== 'string') {
      return (
        <QuestionText style={{ color: '#e74c3c' }}>
          Xato: Savol matni topilmadi yoki yaroqsiz.
        </QuestionText>
      )
    }

    const userAnswers = question.parsedUserAnswers || []

    // 1. Birinchi qatorni (masalan, "Noda (silver)") olib tashlash
    const lines = question.questiontext.split('\n')
    let textAfterFirstLine = lines.slice(1).join('\n').trim()

    // "• " belgisini tozalash
    textAfterFirstLine = textAfterFirstLine.replace(/^•\s*/gm, '').trim()

    // Endi [] blanklarni topib, ularni alohida qismlarga bo'lamiz
    // Regex: ixtiyoriy probellar + ixtiyoriy raqam + ixtiyoriy probellar + "[]"
    const blankRegex = /\s*\d*\s*\[\]/
    const parts = textAfterFirstLine.split(blankRegex)

    // Agar hech qanday [] topilmasa – oddiy matn qaytariladi
    if (parts.length === 1 && !blankRegex.test(textAfterFirstLine)) {
      return <QuestionText>{lines.join('\n')}</QuestionText>
    }

    // parts uzunligi blanklar sonidan 1 taga ko'p bo'ladi
    return (
      <QuestionText>
        {/* Birinchi qatorni (masalan, "Noda (silver)") alohida ko'rsatamiz */}
        {lines[0] && <div style={{ marginBottom: '8px', fontWeight: '600' }}>{lines[0]}</div>}
        
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            
            {/* Oxirgi qismdan keyin javob qo'ymaymiz */}
            {index < parts.length - 1 && (
              <span
                style={{
                  backgroundColor: '#f1c40f',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  margin: '0 4px',
                  fontWeight: 'bold',
                  color: '#2c3e50',
                  display: 'inline-block',
                  minWidth: '60px',
                  textAlign: 'center',
                }}
              >
                {userAnswers[index] || '__________'}
              </span>
            )}
          </React.Fragment>
        ))}
      </QuestionText>
    )
  }

  const renderAnswerContent = (question) => {
    const userAnswers = question.parsedUserAnswers || []

    if (question.type === 'radio' || question.type === 'select') {
      return (
        <OptionsList>
          {question.options?.map((option, idx) => {
            const isSelected = userAnswers.includes(option)
            return (
              <OptionItem key={idx} isSelected={isSelected}>
                {option}
              </OptionItem>
            )
          })}
        </OptionsList>
      )
    }

    return <AnswerContent>{userAnswers.join(', ')}</AnswerContent>
  }

  return (
    <MainContainer>
      <HeaderSection>
        <Title>Tinglash Natijalari</Title>
        <Subtitle>Foydalanuvchi javoblarini tahlil qilish</Subtitle>
      </HeaderSection>

      <QuestionDisplay>
        {answers?.length > 0 ? (
          answers.map((question) => (
            <QuestionCard key={question.id}>
              <QuestionNumber>{question.questionnumber}</QuestionNumber>

              {/* TEXT va TEXT-MULTI */}
              {(question.type === 'text' || question.type === 'text-multi') ? (
                renderTextQuestion(question)
              ) : (
                <QuestionText>{question.questiontext}</QuestionText>
              )}

              {/* RADIO/SELECT uchun javoblar */}
              {!(question.type === 'text' || question.type === 'text-multi') && (
                <AnswerSection>
                  <AnswerLabel>Foydalanuvchining Javobi:</AnswerLabel>
                  {renderAnswerContent(question)}
                </AnswerSection>
              )}
            </QuestionCard>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
            Bu foydalanuvchi uchun javoblar topilmadi.
          </div>
        )}
      </QuestionDisplay>
    </MainContainer>
  )
}

export default UserAnswer