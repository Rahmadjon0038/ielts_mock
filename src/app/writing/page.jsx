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
import { useGetWritingAdmin, usesetWritingAnswer } from '@/hooks/writing'
import { useAddUntied, useGetUntied } from '@/hooks/untied'
import Untied from '@/components/untied'

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

  // --------------- untied data --------------
  const section = pathname.split('/').pop();
  const untied = {
    monthId: latestMonth?.id,
    userId: user?.user?.id,
    section: section,
  }
  const { data, isLoading, error } = useGetUntied(untied); // bu yechilgan malumotni olish


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
    notify('ok', 'TASK 1 yuborildi! Endi TASK 2 ni bajaring.');
    setActiveTab('task2');
  } else {
    setAnswerWriting.mutate(newAnswer);
    notify('ok', 'Har ikkala TASK yuborildi!');
    untiedmutation.mutate(untied);
  }
};



  if (monthLoading || writingLoading) {
    return <Loader />
  }

  return (
    <GlobalContainer full={'full'}>
      <h2 style={{ marginBottom: '1.5rem',marginLeft:'20px'}}>✍️ Writing Task {latestMonth?.month}</h2>

      {data?.submitted ?
        <Untied/>
        :
        <div>

          {!writingTask ? (
            <NoResult message="❌ Writing mavjud emas." />
          ) : Object.keys(writingTask).length === 0 ? (
            <NoResult message="🕓 Writing testlar hali qo‘shilmagan." />
          ) : (
            <div>
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
            </div>
          )}
        </div>
      }
    </GlobalContainer>
  )
}

export default Writing
