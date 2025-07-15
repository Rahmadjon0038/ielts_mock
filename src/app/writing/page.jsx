'use client'

import React, { useEffect, useState } from 'react'
import { GlobalContainer } from '@/globalStyle'
import {
  AnswerBox,
  Container,
  StyledTextarea,
  SubmitButton,
  TabButton,
  TabRow,
  TaskBox,
  WordCount
} from './style'
import { useLatestMonth } from '@/hooks/useLatestMonth'
import Cookies from 'js-cookie'
import Loader from '@/components/loader/Loader'
import NoResult from '@/components/NoResult'
import { getNotify } from '@/hooks/notify'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/userData'
import { useGetWritingAdmin } from '@/hooks/writing'

function Writing() {
  const { data: latestMonth, isLoading: monthLoading } = useLatestMonth()
  const { data: writingTask, isLoading: writingLoading, refetch } = useGetWritingAdmin(latestMonth?.id)
  Cookies.set('activemonth', latestMonth?.id)
  const notify = getNotify();
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState('task1')
  const [answers, setAnswers] = useState({
    task1: '',
    task2: ''
  })

  const wordCount = answers[activeTab].trim().split(/\s+/).filter(Boolean).length

  const handleChange = (e) => {
    const value = e.target.value
    setAnswers((prev) => ({
      ...prev,
      [activeTab]: value
    }))
  }
  const pathname = usePathname()

  const handleSubmit = () => {
    const section = pathname.split('/').pop() // oxirgi qismni olamiz

    if (wordCount < 250) {
      notify('err', 'Kamida 250 ta so‘z yozilishi kerak!')
      return
    }
    let newAnswer = {
      userId: user?.user?.id,
      monthId: latestMonth?.id,
      section: section,
      answers
    }
    console.log(newAnswer, 'salom')
    notify(`ok`, `${activeTab.toUpperCase()} yuborildi!`)
  }



  if (monthLoading || writingLoading) {
    return <Loader />
  }

  return (
    <GlobalContainer full={'full'}>
      <h2 style={{ marginBottom: '1.5rem' }}>✍️ Writing Task  {latestMonth?.month}</h2>
      <h2>task id {latestMonth?.id}</h2>

      {!writingTask ? <NoResult message='There are currently no Writing tests in this section. Stay tuned for updates soon!' /> :
        <div>
          <Container>
            <TaskBox>
              <p>{writingTask[activeTab]}</p>
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
            <TabButton onClick={() => setActiveTab('task1')}>
              Part 1
            </TabButton>
            <TabButton  onClick={() => setActiveTab('task2')}>
              Part 2
            </TabButton>
          </TabRow>
        </div>
      }
    </GlobalContainer>
    // active={activeTab === 'task2'}
  )
}

export default Writing
