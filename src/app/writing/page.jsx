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
  const [timeLeft, setTimeLeft] = useState(0.2 * 60)
  const timerRef = useRef(null)

  const pathname = usePathname()
  const section = pathname.split('/').pop();
  const untied = {
    monthId: latestMonth?.id,
    userId: user?.user?.id,
    section: section,
  }
  const { data, isLoading, error } = useGetUntied(untied); // bu yechilgan malumotni olish

  useEffect(() => {
    if (data?.submitted) {
      clearInterval(timerRef.current); // <-- MUHIM
      setTimeLeft(0);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [data]);


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
    if (data?.submitted) return;

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

    // Doim ikkala task yuboriladi
    setAnswerWriting.mutate(newAnswer);
    console.log(newAnswer,'page')
    untiedmutation.mutate(untied);
    clearInterval(timerRef.current); // vaqtni to‘xtatamiz
    setTimeLeft(0);
  };

  if (monthLoading || writingLoading) {
    return <div style={{ position: 'relative', height: '500px' }}><Loader /></div>
  }

  // NoResult — writing yo‘q bo‘lsa yoki bo‘sh bo‘lsa
  if (!writingTask || Object.keys(writingTask).length === 0) {
    return <NoResult writing={'writing'} message="❌ There are no writing tests." />
  }

  return (
    <GlobalContainer full={'full'}>

      {
        // data?.submitted ?
        //   <Untied />
        //   :
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
                      ? 'Write a 150+ word answer...'
                      : 'Write a 250+ word answer...'
                  }
                />
                <WordCount>Number of words: {wordCount}</WordCount>


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
            <SubmitButton onClick={handleSubmit}>
              {'Yakuniy yuborish'}
            </SubmitButton>
          </>
      }

    </GlobalContainer>
  )
}

export default Writing
