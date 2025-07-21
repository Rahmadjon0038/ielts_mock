'use client'

import React, { useEffect, useRef, useState } from 'react'
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
import { useGetWritingAdmin, usesetWritingAnswer } from '@/hooks/writing'
import { useAddUntied, useGetUntied } from '@/hooks/untied'
import Untied from '@/components/untied'
import { Times } from '@/components/reading/style'

function Writing() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  const { data: latestMonth, isLoading: monthLoading } = useLatestMonth()
  const { data: writingTask, isLoading: writingLoading, refetch } = useGetWritingAdmin(latestMonth?.id)
  const setAnswerWriting = usesetWritingAnswer()
  const untiedmutation = useAddUntied() //  bolimni yechgani haqida malumot
  Cookies.set('activemonth', latestMonth?.id)
  const notify = getNotify()
  const { user } = useAuth()
  const pathname = usePathname()
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const timerRef = useRef(null)

  const section = pathname.split('/').pop();
  const untied = {
    monthId: latestMonth?.id,
    userId: user?.user?.id,
    section: section,
  }
  const { data, isLoading, error } = useGetUntied(untied); // bu yechilgan malumotni olish
  useEffect(() => {
    // Agar writing task yo'q bo‘lsa yoki allaqachon submitted bo‘lsa — timerni to‘xtatamiz
    if (!writingTask || Object.keys(writingTask).length === 0 || data?.submitted) {
      clearInterval(timerRef.current);
      setTimeLeft(0);
      return;
    }

    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, data?.submitted, writingTask]);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60)
    const sec = totalSeconds % 60
    return `${min}:${sec < 10 ? `0${sec}` : sec}`
  }

  // --------------- untied data --------------


  const [activeTab, setActiveTab] = useState('task1')
  const [answer, setAnswer] = useState({
    task1: '',
    task2: ''
  })

  const wordCount = answer[activeTab].trim().split(/\s+/).filter(Boolean).length

  const handleChange = (e) => {
    const value = e.target.value
    setAnswer((prev) => ({
      ...prev,
      [activeTab]: value
    }))
  }
  const handleSubmit = () => {
    const sanitizedAnswer = {
      task1: answer.task1?.trim() === '' ? ' ' : answer.task1,
      task2: answer.task2?.trim() === '' ? ' ' : answer.task2,
    };

    const newAnswer = {
      userId: user?.user?.id,
      monthId: latestMonth?.id,
      section: section,
      answer: sanitizedAnswer,
    };

    if (activeTab === 'task1') {
      setActiveTab('task2');
    } else {
      setAnswerWriting.mutate(newAnswer);
      untiedmutation.mutate(untied);
    }
  };


  if (monthLoading || writingLoading) {
    return <div style={{ position: 'relative', height: '500px' }}><Loader /></div>
  }

  // NoResult — writing yo‘q bo‘lsa yoki bo‘sh bo‘lsa
  if (!writingTask || Object.keys(writingTask).length === 0) {
    return <NoResult writing={'writing'} message="❌ Writing testlar mavjud emas." />
  }

  return (
    <GlobalContainer full={'full'}>
      {data?.submitted ?
        <Untied />
        :
        <>
          <h2 style={{ marginBottom: '1.5rem', marginLeft: '20px' }}>✍️ Writing Task {latestMonth?.month}</h2>
          <Times>
            <p>{formatTime(timeLeft)}</p>
          </Times>


          <Container>
            <TaskBox>
              <p>{writingTask[activeTab]}</p>
              {activeTab === 'task1' && writingTask.task1_image && (
                <img
                  src={`${baseUrl}/uploads/${writingTask.task1_image}`}
                  alt="Task 1"
                  style={{ maxWidth: '100%', marginTop: '1rem' }}
                />
              )}

              {activeTab === 'task2' && writingTask.task2_image && (
                <img
                  src={`${baseUrl}/uploads/${writingTask.task2_image}`}
                  alt="Task 2"
                  style={{ maxWidth: '100%', marginTop: '1rem' }}
                />
              )}

            </TaskBox>
            <AnswerBox>
              <StyledTextarea
                rows="10"
                value={answer[activeTab]}
                onChange={handleChange}
                placeholder={
                  activeTab === 'task1'
                    ? '150+ ta so‘zli javob yozing...'
                    : '250+ ta so‘zli javob yozing...'
                }
              />
              <WordCount>So‘zlar soni: {wordCount}</WordCount>
              <SubmitButton onClick={handleSubmit}>
                {activeTab === 'task1' ? 'Keyingisiga o‘tish' : 'Yakuniy yuborish'}
              </SubmitButton>
            </AnswerBox>
          </Container>

          <TabRow>
            <TabButton active={activeTab === 'task1'} onClick={() => setActiveTab('task1')}>
              Part 1
            </TabButton>
            <TabButton active={activeTab === 'task2'} onClick={() => setActiveTab('task2')}>
              Part 2
            </TabButton>
          </TabRow>
        </>
      }

    </GlobalContainer>
  )
}

export default Writing
