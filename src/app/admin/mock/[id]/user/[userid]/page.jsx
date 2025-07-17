'use client'
import Loader from '@/components/loader/Loader'
import { GlobalContainer } from '@/globalStyle'
import { useAassessment, useGetAllusersRatings, useGetWritingAdmin, useGetWritingAnswerMonthAdmin } from '@/hooks/writing'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  SectionContainer,
  SectionTitle,
  TaskText,
  Label,
  Input,
  SaveButton,
  Images,
} from './style'

function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const paramdata = useParams()
  // --------------------------------Writing uchun admin uzi yozgan savoolarini olish -------------------
  const { data: writingTask, isLoading: writingLoading, refetch } = useGetWritingAdmin(paramdata?.id)

  // --------------------------------Writing uchun user  yozgan javoblarni olish -------------------
  const { data: writingData, isLoading } = useGetWritingAnswerMonthAdmin({
    monthid: paramdata?.id,
    userid: paramdata?.userid,
  })

  const { data: assessmentData, isLoading: userIsLoading, error } = useGetAllusersRatings({
    monthId: paramdata?.id,
    userId: paramdata?.userid,
  })

  const [reading, setReading] = useState(null)
  const [listening, setListening] = useState(null)

  const [grades, setGrades] = useState({
    Writing: '',
    Reading: '',
    Listening: '',
    Speaking: '',
  })

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

      document.getElementById("Writing-comment").value = normalized.Writing?.comment || ''
      document.getElementById("Reading-comment").value = normalized.Reading?.comment || ''
      document.getElementById("Listening-comment").value = normalized.Listening?.comment || ''
      document.getElementById("Speaking-comment").value = normalized.Speaking?.comment || ''
    }
  }, [assessmentData])





  // --------------------------- assasment- -------------------------------
  const setAassessment = useAassessment();
  const handleSaveGrade = async (section) => {
    const grade = grades[section];
    const commentInput = document.getElementById(`${section}-comment`);
    const comment = commentInput?.value || "";
    setAassessment.mutate({
      section: section,
      score: grade,
      comment: comment,
      paramdata
    })
  };


  if (isLoading) return <Loader />

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
            <TaskText>1) {item.task1}</TaskText>
            <hr />
            <TaskText>2) {item.task2}</TaskText>
            <Label>Admin yozgan baho:</Label>
            <Input
              placeholder="e.g. 6.5"
              defaultValue={grades?.Writing}
              value={grades.Writing}
              onChange={(e) => setGrades({ ...grades, Writing: e.target.value })}
            />
            <Input
              id="Writing-comment"
              placeholder="comment"
            />
            <SaveButton onClick={() => handleSaveGrade('Writing')}>Save Grade</SaveButton>
          </div>
        ))}
      </SectionContainer>

      {/* === READING === */}
      <SectionContainer>
        <SectionTitle>Reading</SectionTitle>
        <Label>Savol:</Label>
        <TaskText>{reading?.question}</TaskText>

        <Label>Correct Answer (Admin):</Label>
        <TaskText>{reading?.correctAnswer}</TaskText>

        <Label>User Answer:</Label>
        <TaskText>{reading?.userAnswer}</TaskText>

        <Label>Bahoni tekshiring (avtomatik):</Label>
        <Input
          placeholder="e.g. 8"
          value={grades.Reading}
          onChange={(e) => setGrades({ ...grades, Reading: e.target.value })}
        />

        <Input
          id="Reading-comment"
          placeholder="comment"
        />

        <SaveButton onClick={() => handleSaveGrade('Reading')}>Save Grade</SaveButton>
      </SectionContainer>

      {/* === LISTENING === */}
      <SectionContainer>
        <SectionTitle>Listening</SectionTitle>
        <Label>Savol:</Label>
        <TaskText>{listening?.question}</TaskText>

        <Label>Correct Answer (Admin):</Label>
        <TaskText>{listening?.correctAnswer}</TaskText>

        <Label>User Answer:</Label>
        <TaskText>{listening?.userAnswer}</TaskText>

        <Label>Bahoni tekshiring (avtomatik):</Label>
        <Input
          placeholder="e.g. 7"
          value={grades.Listening}
          onChange={(e) => setGrades({ ...grades, Listening: e.target.value })}
        />

        <Input
          id="Listening-comment"
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
          id="Speaking-comment"
          placeholder="comment"
        />
        <SaveButton onClick={() => handleSaveGrade('Speaking')}>Save Grade</SaveButton>
      </SectionContainer>
    </GlobalContainer>
  )
}

export default Page
