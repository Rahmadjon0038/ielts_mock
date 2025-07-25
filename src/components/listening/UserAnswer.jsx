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
      parsedUserAnswers: answer.userAnswers ? JSON.parse(answer.userAnswers) : [],
    }))
  }

  if (isLoading) {
    return <StatusMessage>Loading user answers...</StatusMessage>
  }

  if (error) {
    return (
      <StatusMessage style={{ color: '#e74c3c' }}>
        Failed to load user answers. Please try again later.
      </StatusMessage>
    )
  }

  const answers = data?.answers ? parseAnswers(data.answers) : []

  const renderAnswer = (question) => {
    const answers = question.parsedUserAnswers

    if (question.type === 'text' || question.type === 'text-multi') {
      let replacedText = question.questionText
      answers.forEach((ans) => {
        const highlighted = `<span class="highlight">${ans}</span>`
        replacedText = replacedText.replace('[]', highlighted)
      })

      return (
        <AnswerContent>
          <QuestionText dangerouslySetInnerHTML={{ __html: replacedText }} />
        </AnswerContent>
      )
    }

    if (question.type === 'radio' || question.type === 'select') {
      return (
        <OptionsList>
          {question.options?.map((option, idx) => (
            <OptionItem key={idx} isSelected={answers.includes(option)}>
              {option}
            </OptionItem>
          ))}
        </OptionsList>
      )
    }

    return <AnswerContent>{answers.join(', ')}</AnswerContent>
  }

  return (
    <MainContainer>
      <HeaderSection>
        <Title>Listening Results</Title>
        <Subtitle>User response analysis</Subtitle>
      </HeaderSection>

      <QuestionDisplay>
        {answers?.length > 0 ? (
          answers.map((question) => (
            <QuestionCard key={question.id}>
              <QuestionNumber>{question.questionNumber}</QuestionNumber>
              {(question.type === 'radio' || question.type === 'select') && (
                <QuestionText>{question.questionText}</QuestionText>
              )}

              <AnswerSection>
                {question.type !== 'text' && question.type !== 'text-multi' && (
                  <AnswerLabel>User's Answer:</AnswerLabel>
                )}
                {renderAnswer(question)}
              </AnswerSection>
            </QuestionCard>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No answers found for this user.
          </div>
        )}
      </QuestionDisplay>
    </MainContainer>
  )
}

export default UserAnswer
