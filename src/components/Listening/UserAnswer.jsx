'use client'

import React from 'react'
import {
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
  AnswerLabel,
} from './style'
import { useGetListeningAnswers } from '@/hooks/listening'
import { useParams } from 'next/navigation'


function UserAnswer() {
  const params = useParams()
  // URL parametrlardan ID larni olish va butun songa o'tkazish
  const monthId = parseInt(params.monthId || params.id, 10)
  const userId = parseInt(params.userId || params.userid, 10)

  const COLOR_SELECTED = '#3498db' // Moviy – tanlangan javob
  const COLOR_TEXT_ANSWER = '#f1c40f' // Sariq – text blank javobi


  const { data, isLoading, error } = useGetListeningAnswers({ monthId, userId })

  const parseAnswers = (answers) => {
    return answers.map((answer) => {
      let parsedUserAnswers = []

      // --- 1. useranswers ni har xil formatdan bir xil massivga aylantirish (TUZAILDLARI BILAN) ---
      if (Array.isArray(answer.useranswers)) {
        parsedUserAnswers = answer.useranswers.map(String)
      } else if (typeof answer.useranswers === 'string') {
        
        // CHECKBOX javoblarini to'g'ri ajratish (masalan, "B, D, C" → ["B", "D", "C"])
        if (answer.type === 'checkbox' && answer.useranswers.includes(',')) {
            parsedUserAnswers = answer.useranswers
              .split(',')
              .map((s) => s.trim().toUpperCase()) // Harflarni katta harfga o'tkazamiz
              .filter((s) => s.length > 0)
        } else {
            // Oddiy 'text' javobi yoki yagona radio tanlovi uchun
            const trimmedAnswer = answer.useranswers.trim();
            if (trimmedAnswer.length > 0) {
                parsedUserAnswers = [trimmedAnswer];
            } else {
                parsedUserAnswers = [];
            }
        }
      } else if (answer.useranswers !== null && answer.useranswers !== undefined) {
        parsedUserAnswers = [String(answer.useranswers)]
      }
      
      // Options ni tozalash: "A. Breakfast only" → "Breakfast only", va harfni saqlab qolamiz
      const cleanedOptions = (answer.options || []).map((opt, idx) => {
        if (typeof opt === 'string') {
          // A. Breakfast only dan A. ni ajratib tashlash uchun Regex
          const match = opt.match(/^[A-Z]\.?\s*(.*)/i)
          return {
            letter: String.fromCharCode(65 + idx), // A, B, C...
            text: match ? match[1].trim() : opt.trim(),
            full: opt.trim(),
          }
        }
        return {
          letter: String.fromCharCode(65 + idx),
          text: opt || '',
          full: opt || '',
        }
      })

      return {
        ...answer,
        // Javoblarni taqqoslashni osonlashtirish uchun katta harfga o'tkazish (faqat bitta harf bo'lsa)
        parsedUserAnswers: parsedUserAnswers.map(ans => ans.length === 1 ? ans.toUpperCase() : ans),
        cleanedOptions,
      }
    })
  }

  if (isLoading) {
    return <StatusMessage>Javoblar yuklanmoqda...</StatusMessage>
  }

  if (error) {
    return (
      <StatusMessage style={{ color: '#e74c3c' }}>
        Xatolik: Javoblarni yuklab bo'lmadi. {error.message || ''}
      </StatusMessage>
    )
  }

  const answers = data?.answers ? parseAnswers(data.answers) : []
  const sortedAnswers = answers.sort((a, b) => a.questionnumber - b.questionnumber)

  // TEXT va TEXT-MULTI savollar uchun blanklarni to'ldirish
  const renderTextQuestion = (question) => {
    const userAnswers = question.parsedUserAnswers || []
    let text = question.questiontext || ''
    let answerIndex = 0

    // --- BU YER TUZATILDI: Regex endi oddiy [] ni ham topadi ---
    // (1) [], (2) [] yoki faqat [] kabi blanklarni topish
    const parts = text.split(/(\(\d+\)\s*\[\]|\[\])/g)

    return (
      <QuestionText>
        {parts.map((part, i) => {
          // Agar qism ([1] [] yoki [] ) belgisiga mos kelsa
          if (part.match(/(\(\d+\)\s*\[\]|\[\])/)) {
            const userAnswer = userAnswers[answerIndex] || '__________'
            answerIndex++
            return (
              <React.Fragment key={i}>
                {/* Agar (1) [] bo'lsa, faqat (1) ni qoldirib, [] ni olib tashlaymiz */}
                {part.match(/\(\d+\)\s*\[\]/) ? part.replace('[]', '') : ''} 
                <span
                  style={{
                    backgroundColor: COLOR_TEXT_ANSWER,
                    color: '#2c3e50',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    margin: '0 6px',
                    display: 'inline-block',
                    minWidth: '80px',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                  }}
                >
                  {userAnswer}
                </span>
              </React.Fragment>
            )
          }
          return <span key={i} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br/>') }} />
        })}
      </QuestionText>
    )
  }

  // RADIO va CHECKBOX savollar uchun
  const renderChoiceQuestion = (question) => {
    const userAnswers = question.parsedUserAnswers || []
    const options = question.cleanedOptions || []
    const isCheckbox = question.type === 'checkbox'

    return (
      <>
        <QuestionText
          dangerouslySetInnerHTML={{
            __html: (question.questiontext || '').replace(/\n/g, '<br/>'),
          }}
        />

        <AnswerSection style={{ marginTop: '20px' }}>
          <AnswerLabel>
            Foydalanuvchi tanlovi:
            <strong style={{ color: COLOR_SELECTED, marginLeft: '8px' }}>
              {userAnswers.length > 0 ? userAnswers.join(', ') : 'Javob berilmagan'}
            </strong>
          </AnswerLabel>

          <OptionsList>
            {options.map((opt, idx) => {
              // Tanlangan javobni taqqoslashda katta harfga o'tkazishni ta'minlash
              const isSelected = userAnswers.includes(opt.letter.toUpperCase()) 
              return (
                <OptionItem
                  key={idx}
                  $isSelected={isSelected}
                  style={
                    isSelected
                      ? {
                        backgroundColor: `${COLOR_SELECTED}22`,
                        border: `2px solid ${COLOR_SELECTED}`,
                        fontWeight: 'bold',
                        boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)',
                      }
                      : {}
                  }
                >
                  <span style={{ fontWeight: 'bold', color: COLOR_SELECTED, marginRight: '10px' }}>
                    {opt.letter}.
                  </span>
                  {opt.text}
                  {isSelected && (
                    <span style={{ float: 'right', fontSize: '1.4em' }}>
                      {isCheckbox ? '☑️' : '🔘'}
                    </span>
                  )}
                </OptionItem>
              )
            })}
          </OptionsList>
        </AnswerSection>
      </>
    )
  }

  return (
    <MainContainer>
      <HeaderSection>
        <Title>📋 Foydalanuvchi Javoblari</Title>
        <Subtitle>
          Foydalanuvchi: <strong>№{userId}</strong> | Oy: <strong>№{monthId}</strong>
        </Subtitle>
      </HeaderSection>
      <QuestionDisplay>
        {sortedAnswers.length > 0 ? (
          sortedAnswers.map((question) => (
            <QuestionCard key={question.id}>
              <QuestionNumber>{question.questionnumber}</QuestionNumber>

              {question.type === 'text' || question.type === 'text-multi' ? (
                renderTextQuestion(question)
              ) : (
                renderChoiceQuestion(question)
              )}
            </QuestionCard>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: '#95a5a6', fontSize: '1.2em' }}>
            ⚠️ Bu foydalanuvchi uchun javoblar mavjud emas.
          </div>
        )}
      </QuestionDisplay>
    </MainContainer>
  )
}

export default UserAnswer