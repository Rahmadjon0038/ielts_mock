'use client'

import React, { useState } from 'react'
import { GlobalContainer } from '@/globalStyle'
import { AnswerBox, Container, StyledTextarea, SubmitButton, TabButton, TabRow, TaskBox, WordCount } from './style'

const tasks = {
  part1: `Describe a time when you received good news. You should say:

– what the news was  
– who told you the news  
– how you reacted  
– and explain why this news was important to you.

Receiving good news can make a significant impact on your emotions and overall outlook. Think about a personal experience that left a lasting impression on you.
`,
  part2: `Some people believe that unpaid community service such as helping the elderly, working in a charity, or teaching underprivileged children should be a compulsory part of high school programs.

To what extent do you agree or disagree with this opinion? Support your point of view with relevant examples and explanations.
`
}

function Writing() {
  const [activeTab, setActiveTab] = useState('part1')
  const [answers, setAnswers] = useState({
    part1: '',
    part2: ''
  })

  const wordCount = answers[activeTab].trim().split(/\s+/).filter(Boolean).length

  const handleChange = (e) => {
    const value = e.target.value
    setAnswers((prev) => ({
      ...prev,
      [activeTab]: value
    }))
  }

  const handleSubmit = () => {
    if (wordCount < 250) {
      alert('Kamida 250 ta so‘z yozilishi kerak!')
      return
    }
    console.log(`Yuborilgan [${activeTab}] matn:`, answers[activeTab])
    alert(`${activeTab.toUpperCase()} yuborildi!`)
  }

  return (
    <GlobalContainer full={'full'}>
      <h2 style={{ marginBottom: '1.5rem' }}>✍️ Writing Task</h2>


      <Container>
        <TaskBox>
          <p>{tasks[activeTab]}</p>
        </TaskBox>

        <AnswerBox>
          <StyledTextarea
            rows="10"
            value={answers[activeTab]}
            onChange={handleChange}
            placeholder="250+ ta so‘zli javob yozing..."
          />
          <WordCount>So‘zlar soni: {wordCount}</WordCount>
          <SubmitButton onClick={handleSubmit}>Yuborish</SubmitButton>
        </AnswerBox>
      </Container>

      <TabRow>
        <TabButton active={activeTab === 'part1'} onClick={() => setActiveTab('part1')}>
          Part 1
        </TabButton>
        <TabButton active={activeTab === 'part2'} onClick={() => setActiveTab('part2')}>
          Part 2
        </TabButton>
      </TabRow>
    </GlobalContainer>
  )
}

export default Writing
