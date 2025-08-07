'use client'

import React, { useEffect, useMemo,  useState } from 'react'
import { GlobalContainer, TextBlock } from '@/globalStyle'
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
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/userData'
import { useGetWritingAdmin, usesetWritingAnswer } from '@/hooks/writing'
import { useAddUntied, useGetUntied } from '@/hooks/untied'
import Untied from '@/components/untied'
import { Times } from '@/components/reading/style'
import Countdown from 'react-countdown';
import TimerModal from '@/components/Timer/TimerComponent'
import { useAddtimer, useGetTimer } from '@/hooks/timer'
import MiniLoader from '@/components/MiniLoader/MiniLoader'

function Writing() {
  const { user } = useAuth()
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { data: latestMonth, isLoading: monthLoading } = useLatestMonth()
  const { data: writingTask, isLoading: writingLoading, refetch } = useGetWritingAdmin(latestMonth?.id)
  const setAnswerWriting = usesetWritingAnswer()
  const untiedmutation = useAddUntied() //  bolimni yechgani haqida malumot

  const pathname = usePathname()
  const section = pathname.split('/').pop();
  const timerMutation = useAddtimer();
  const { data: timer, isLoading: timerLoading, error: timerError } = useGetTimer(user?.user?.id, section, latestMonth?.id)  // vaqtni olish
  Cookies.set('activemonth', latestMonth?.id)

  useEffect(() => {
    if (user?.user?.id && section) {
      timerMutation.mutate({ userId: user?.user?.id, section: section, monthId: latestMonth?.id });
    }
  }, []);

  const untied = {
    monthId: latestMonth?.id,
    userId: user?.user?.id,
    section: section,
  }
  const { data, isLoading, error } = useGetUntied(untied); // bu yechilgan malumotni olish

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

  function handleSubmit() {
    if (data?.submitted) return;

    const sanitizedAnswer = {
      task1: answer.task1,
      task2: answer.task2
    };

    const newAnswer = {
      userId: user?.user?.id,
      monthId: latestMonth?.id,
      section: section,
      answer: sanitizedAnswer,
    };

    setAnswerWriting.mutate(newAnswer);
    console.log(newAnswer, 'page')
    untiedmutation.mutate(untied);
  };

  const endTime = useMemo(() => {
    if (!timer?.startTime) return null; // hali kelmagan bo‘lsa
    return new Date(new Date(timer.startTime).getTime() + 660 * 60 * 1000);
  }, [timer?.startTime]);


  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      return <TimerModal untieddata={data?.submitted} handleSubmit={handleSubmit} show={true} />;
    } else {
      return <span>{minutes}:{seconds.toString().padStart(2, '0')}</span>;
    }
  };

  if (monthLoading || writingLoading) {
    return <div style={{ position: 'relative', height: '500px' }}><Loader /></div>
  }

  // NoResult — writing yo‘q bo‘lsa yoki bo‘sh bo‘lsa
  if (!writingTask || Object.keys(writingTask).length === 0) {
    return <NoResult writing={'writing'} message="❌ There are no writing tests." />
  }

  console.log(writingTask)

  return (
    <div style={{ minHeight: '100vh' }}>
      <GlobalContainer full={'full'}>
        {
          data?.submitted ?
            <Untied />
            :
            <>
              <h2 style={{ marginBottom: '1.5rem', marginLeft: '20px' }}>✍️ Writing Task {latestMonth?.month}</h2>
              <Times>
                <p>
                  {endTime ? (
                    <Countdown date={endTime} renderer={renderer} />
                  ) : (
                    <MiniLoader/>
                  )}

                </p>
              </Times>

              <Container>
                <TaskBox>
                  
                  <TextBlock>{writingTask[activeTab]}</TextBlock>
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
                    spellCheck={false}
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
                {'Send'}
              </SubmitButton>
            </>
        }

      </GlobalContainer>
    </div>
  )
}

export default Writing
