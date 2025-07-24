'use client'

import Loader from '@/components/loader/Loader'
import { GlobalContainer } from '@/globalStyle'
import {
  useAassessment,
  useGetAllusersRatings,
  useGetWritingAdmin,
  useGetWritingAnswerMonthAdmin,
} from '@/hooks/writing'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, useRef } from 'react'
import {
  SectionContainer,
  SectionTitle,
  TaskText,
  Label,
  Input,
  SaveButton,
  Images,
} from './style'
import ReadingAnswer from '@/components/admin/CreateMockModal/section/ReadingAnswer'
import UserAnswer from '@/components/listening/UserAnswer'

function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const paramdata = useParams()

  // ===== Hooks
  const { data: writingTask, isLoading: writingLoading } = useGetWritingAdmin(paramdata?.id)
  const { data: writingData, isLoading } = useGetWritingAnswerMonthAdmin({
    monthid: paramdata?.id,
    userid: paramdata?.userid,
  })
  const { data: assessmentData } = useGetAllusersRatings({
    monthId: paramdata?.id,
    userId: paramdata?.userid,
  })

  // ===== useRefs for comments
  const writingCommentRef = useRef(null)
  const readingCommentRef = useRef(null)
  const listeningCommentRef = useRef(null)
  const speakingCommentRef = useRef(null)

  // ===== Grades state
  const [grades, setGrades] = useState({
    Writing: '',
    Reading: '',
    Listening: '',
    Speaking: '',
  })

  // Normalize fetched data
  const normalizeGrades = (gradesArray) => {
    const result = {}
    gradesArray.forEach(({ section, score, comment }) => {
      result[section] = { score, comment }
    })
    return result
  }

  useEffect(() => {
    if (assessmentData?.length) {
      const normalized = normalizeGrades(assessmentData)

      setGrades({
        Writing: normalized.Writing?.score || '',
        Reading: normalized.Reading?.score || '',
        Listening: normalized.Listening?.score || '',
        Speaking: normalized.Speaking?.score || '',
      })

      if (writingCommentRef.current) writingCommentRef.current.value = normalized.Writing?.comment || ''
      if (readingCommentRef.current) readingCommentRef.current.value = normalized.Reading?.comment || ''
      if (listeningCommentRef.current) listeningCommentRef.current.value = normalized.Listening?.comment || ''
      if (speakingCommentRef.current) speakingCommentRef.current.value = normalized.Speaking?.comment || ''
    }
  }, [assessmentData])

  // ===== Save handler
  const setAassessment = useAassessment()
  const handleSaveGrade = (section) => {
    let comment = ''
    if (section === 'Writing') comment = writingCommentRef.current?.value || ''
    if (section === 'Reading') comment = readingCommentRef.current?.value || ''
    if (section === 'Listening') comment = listeningCommentRef.current?.value || ''
    if (section === 'Speaking') comment = speakingCommentRef.current?.value || ''

    const grade = grades[section]
    setAassessment.mutate({
      section,
      score: grade,
      comment,
      paramdata,
    })
  }

  if (isLoading || writingLoading) return <Loader />

  return (
    <GlobalContainer>
      {/* === WRITING === */}
      <SectionContainer>
        <SectionTitle>Writing</SectionTitle>
        {writingData?.map((item) => (
          <div key={item.id}>
            <Label>Savol (Admin tomonidan):</Label>
            <TaskText>1) {writingTask?.task1}</TaskText>
            <Images
              src={`${baseUrl}/uploads/${writingTask?.task1_image}`}
              alt="Task 1"
              style={{ maxWidth: '100%', marginTop: '1rem' }}
            />
            <br />
            <br />
            <TaskText>2) {writingTask?.task2}</TaskText>
            <TaskText>{item.question}</TaskText>

            <Label>User Javobi:</Label>
            <TaskText>
              1) {item.task1 && item.task1.trim() ? item.task1 : "javob bermagan"}
            </TaskText>
            <hr />
            <TaskText>
              2) {item.task2 && item.task2.trim() ? item.task2 : "javob bermagan"}
            </TaskText>

            <Label>Admin yozgan baho:</Label>
            <Input
              placeholder="e.g. 6.5"
              value={grades.Writing}
              onChange={(e) => setGrades({ ...grades, Writing: e.target.value })}
            />
            <Input
              ref={writingCommentRef}
              placeholder="comment"
            />
            <SaveButton onClick={() => handleSaveGrade('Writing')}>Save Grade</SaveButton>
          </div>
        ))}
      </SectionContainer>

      {/* === READING === */}
      <SectionContainer>
        <ReadingAnswer />

        <Label>Bahoni qo'yish</Label>
        <Input
          placeholder="e.g. 8"
          value={grades.Reading}
          onChange={(e) => setGrades({ ...grades, Reading: e.target.value })}
        />
        <Input
          ref={readingCommentRef}
          placeholder="comment"
        />
        <SaveButton onClick={() => handleSaveGrade('Reading')}>Save Grade</SaveButton>
      </SectionContainer>


      {/* === LISTENING === */}
      <SectionContainer>

        <UserAnswer />

        <Label>Bahoni q'yish</Label>
        <Input
          placeholder="e.g. 7"
          value={grades.Listening}
          onChange={(e) => setGrades({ ...grades, Listening: e.target.value })}
        />
        <Input
          ref={listeningCommentRef}
          placeholder="comment"
        />
        <SaveButton onClick={() => handleSaveGrade('Listening')}>Save Grade</SaveButton>
      </SectionContainer>

      {/* === SPEAKING === */}
      <SectionContainer>
        <SectionTitle>Speaking</SectionTitle>
        <Label>Bahoni kiriting (offline natijaga asosan):</Label>
        <Input
          placeholder="e.g. 7.5"
          value={grades.Speaking}
          onChange={(e) => setGrades({ ...grades, Speaking: e.target.value })}
        />
        <Input
          ref={speakingCommentRef}
          placeholder="comment"
        />
        <SaveButton onClick={() => handleSaveGrade('Speaking')}>Save Grade</SaveButton>
      </SectionContainer>
    </GlobalContainer>
  )
}

export default Page
