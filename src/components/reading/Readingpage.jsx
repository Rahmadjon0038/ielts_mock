'use client'
import React, { useState, useEffect, useRef } from 'react'
import {
  Container,
  Introduction,
  LeftBox,
  RightBox,
  Times,
  QuestionBox,
  Parts,
  Partsitem
} from './style'
import { useLatestMonth } from '@/hooks/useLatestMonth'
import { useGetReadingQuestion } from '@/hooks/user'
import Loader from '../loader/Loader'
import NoResult from '../NoResult'
import { useAuth } from '@/context/userData'
import { usePathname } from 'next/navigation'
import { useAddUntied, useGetUntied } from '@/hooks/untied'
import Untied from '../untied'



function ReadingPage() {
  const { data: latestMonth, isLoading: monthLoading } = useLatestMonth()  //oy ni olib kelish
  const { data: readingQuestion, isLoading: readingLoading, error: readingError } = useGetReadingQuestion(latestMonth?.id);
  const { user } = useAuth();
  const parts = readingQuestion?.parts
  const [timeLeft, setTimeLeft] = useState(60 * 60)
  const [currentPart, setCurrentPart] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const pathname = usePathname()
  const section = pathname.split('/').pop();
  const untied = {
    monthId: latestMonth?.id,
    userId: user?.user?.id,
    section: section,
  }
  const untiedmutation = useAddUntied() //  bolimni yechgani haqida malumot qoshi

  const { data: untieddata, isLoading: untiedLoading, error: untieduntied } = useGetUntied(untied); // bu yechilgan malumotni olish


  const timerRef = useRef(null)
  useEffect(() => {
    if (!latestMonth?.id || !readingQuestion || !readingQuestion.parts) {
      clearInterval(timerRef.current);
      return;
    }

    if (timeLeft <= 0) {
      clearInterval(timerRef.current);
      handleSubmit(); // ⏰ Vaqt tugasa avtomatik yuborish
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [latestMonth?.id, readingQuestion, timeLeft]);

  const formatTime = (totalSeconds) => {
    const min = Math.floor(totalSeconds / 60)
    const sec = totalSeconds % 60
    return `${min}:${sec < 10 ? `0${sec}` : sec}`
  }

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async () => {

    console.log('salom', {
      section,
      monthId: latestMonth?.id,
      userId: user?.user?.id,
      answers,
      timeTaken: 3600 - timeLeft
    })
    untiedmutation.mutate(untied)

  }

  const current = parts && parts.length > 0 ? parts[currentPart] : null
  if (readingLoading || monthLoading) {
    return <div style={{ position: 'relative', height: '500px' }}> <Loader /></div>
  }

  if (
    !readingQuestion ||
    !readingQuestion.parts ||
    readingQuestion.parts.length === 0
  ) {
    return <NoResult message="📭 Reading testlar hali mavjud emas." />
  }

  return (
    <>
      <h2 style={{ marginBottom: '1.5rem', marginLeft: '20px' }}>📚  Reading Task {latestMonth?.month}</h2>
      <Times>
        <p>{formatTime(timeLeft)}</p>
      </Times>

      {/* {untieddata?.submitted ? <Untied />
        :
        <> */}
          <Introduction>
            <h4>{current?.intro}</h4>
          </Introduction>
          <Container>
            <LeftBox>
              <p>{current?.passage}</p>
            </LeftBox>
            <RightBox>
              {current && current?.questions.map((q) => (
                <QuestionBox key={q.id}>
                  <p><strong>{q.number}.</strong> {q.text}</p>

                  {q.type === 'radio' && q.options.map((opt, index) => (
                    <label key={index}>
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={opt}
                        onChange={() => handleAnswerChange(q.id, opt)}
                        checked={answers[q.id] === opt}
                      /> {opt}
                    </label>
                  ))}

                  {q.type === 'select' && (
                    <select
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                    >
                      <option value="">--Select--</option>
                      {q.options.map((opt, idx) => (
                        <option key={idx} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {q.type === 'input' && (
                    <input
                      type="text"
                      value={answers[q.id] || ''}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      placeholder="Your answer"
                    />
                  )}
                </QuestionBox>
              ))}
            </RightBox>
          </Container>
          <Parts>
            {parts && parts?.map((p, idx) => (
              <Partsitem
                key={idx}
                isActive={currentPart === idx}
                onClick={() => setCurrentPart(idx)}
              >
                <b>Part {p.part}</b>
              </Partsitem>
            ))}
          </Parts>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit answers'}
            </button>
            {success && <p style={{ color: 'green' }}>Successfully submitted!</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>
        {/* </>} */}

    </>
  )
}

export default ReadingPage
