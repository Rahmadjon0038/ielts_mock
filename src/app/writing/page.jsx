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

function Writing() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { data: latestMonth, isLoading: monthLoading } = useLatestMonth()
  const { data: writingTask, isLoading: writingLoading, refetch } = useGetWritingAdmin(latestMonth?.id)
  const setAnswerWriting = usesetWritingAnswer()

  Cookies.set('activemonth', latestMonth?.id)
  const notify = getNotify()
  const { user } = useAuth()
  const pathname = usePathname()

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
    const section = pathname.split('/').pop();
    const task1WordCount = answer.task1.trim().split(/\s+/).filter(Boolean).length;
    const task2WordCount = answer.task2.trim().split(/\s+/).filter(Boolean).length;

    if (activeTab === 'task1') {
      if (task1WordCount < 150) {
        notify('err', `TASK 1 uchun kamida 150 ta so‘z yozilishi kerak! Hozirgi: ${task1WordCount}`);
        return;
      }
      notify('ok', 'TASK 1 yuborildi! Endi TASK 2 ni bajaring.');
      setActiveTab('task2');
    } else {
      if (task1WordCount < 150 || task2WordCount < 250) {
        notify(
          'err',
          `Ikkala task ham to‘liq bo‘lishi kerak! 
         TASK 1: ${task1WordCount} ta so‘z (kamida 150),
         TASK 2: ${task2WordCount} ta so‘z (kamida 250).`
        );
        return;
      }

      const newAnswer = {
        userId: user?.user?.id,
        monthId: latestMonth?.id,
        section: section,
        answer,
      };

      setAnswerWriting.mutate(newAnswer);
      notify('ok', 'Har ikkala TASK muvaffaqiyatli yuborildi!');
    }
  };


  if (monthLoading || writingLoading) {
    return <Loader />
  }

  return (
    <GlobalContainer full={'full'}>
      <h2 style={{ marginBottom: '1.5rem' }}>✍️ Writing Task {latestMonth?.month}</h2>
      <h2>task id {latestMonth?.id}</h2>

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
    </GlobalContainer>
  )
}

export default Writing
