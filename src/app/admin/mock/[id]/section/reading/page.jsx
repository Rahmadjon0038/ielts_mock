'use client'
import React, { useState } from 'react'
import {
  PageWrapper, Column, Section, Label, Input,
  Textarea, Button, Select, QuestionCard, RemoveButton, Tabs, Tab
} from './style'
import axios from 'axios'
import { useParams } from 'next/navigation'

function ReadingAdmin() {
  const params = useParams()
  const monthId = Number(params.monthId)
  const [activePart, setActivePart] = useState(1)

  const [data, setData] = useState({
    1: { intro: '', passage: '', questions: [] },
    2: { intro: '', passage: '', questions: [] },
    3: { intro: '', passage: '', questions: [] }
  })

  const handleFieldChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [activePart]: {
        ...prev[activePart],
        [field]: value
      }
    }))
  }

  const handleQuestionChange = (index, field, value) => {
    const updated = [...data[activePart].questions]
    updated[index][field] = value
    handleFieldChange('questions', updated)
  }

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...data[activePart].questions]
    updated[qIndex].options[oIndex] = value
    handleFieldChange('questions', updated)
  }

  const addOption = (qIndex) => {
    const updated = [...data[activePart].questions]
    updated[qIndex].options.push('')
    handleFieldChange('questions', updated)
  }

  const removeOption = (qIndex, oIndex) => {
    const updated = [...data[activePart].questions]
    const removedOption = updated[qIndex].options[oIndex]
    updated[qIndex].options.splice(oIndex, 1)
    if (updated[qIndex].correctAnswer === removedOption) {
      updated[qIndex].correctAnswer = ''
    }
    handleFieldChange('questions', updated)
  }

  const addQuestion = () => {
    const updated = [...data[activePart].questions]
    updated.push({ text: '', type: 'radio', options: [''], correctAnswer: '' })
    handleFieldChange('questions', updated)
  }

  const handleSubmit = async () => {
    const { intro, passage, questions } = data[activePart]

    const readingData = {
      monthId,
      part: activePart,
      intro,
      passage,
      questions: questions.map(({ correctAnswer, ...rest }) => rest)
    }

    const answerData = {
      monthId,
      part: activePart,
      correctAnswers: questions.map((q, index) => ({
        index,
        answer: q.correctAnswer
      }))
    }

    console.log('savollar', readingData)
    console.log('answerData', answerData)

  }

  const { intro, passage, questions } = data[activePart]

  return (
    <PageWrapper>
      {/* Tabs */}
      <Tabs>
        {[1, 2, 3].map(part => (
          <Tab
            key={part}
            active={activePart === part}
            onClick={() => setActivePart(part)}
          >
            Part {part}
          </Tab>
        ))}
      </Tabs>

      <Column>
        <h2>Reading Part {activePart}</h2>

        <Section>
          <Label>Kirish matni (intro)</Label>
          <Input value={intro} onChange={e => handleFieldChange('intro', e.target.value)} />
        </Section>

        <Section>
          <Label>Matn (passage)</Label>
          <Textarea rows={4} value={passage} onChange={e => handleFieldChange('passage', e.target.value)} />
        </Section>

        <h3>Savollar</h3>
        {questions.map((q, index) => (
          <Section key={index}>
            <Label>{index + 1}-savol</Label>
            <Input
              value={q.text}
              onChange={e => handleQuestionChange(index, 'text', e.target.value)}
            />

            <Label>Javob turi</Label>
            <Select
              value={q.type}
              onChange={e => handleQuestionChange(index, 'type', e.target.value)}
            >
              <option value="radio">Radio</option>
              <option value="select">Select</option>
              <option value="input">Input</option>
            </Select>

            {q.type !== 'input' && (
              <>
                <Label>Variantlar</Label>
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Input
                      placeholder={`Variant ${oIndex + 1}`}
                      value={opt}
                      onChange={e => handleOptionChange(index, oIndex, e.target.value)}
                    />
                    <RemoveButton onClick={() => removeOption(index, oIndex)}>X</RemoveButton>
                  </div>
                ))}
                <Button type="button" onClick={() => addOption(index)}>+ Variant</Button>
              </>
            )}

            <Label>To‘g‘ri javob</Label>
            {q.type === 'input' ? (
              <Input
                placeholder="To‘g‘ri javobni yozing"
                value={q.correctAnswer}
                onChange={e => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              />
            ) : (
              <Select
                value={q.correctAnswer}
                onChange={e => handleQuestionChange(index, 'correctAnswer', e.target.value)}
              >
                <option value="">Tanlang...</option>
                {q.options.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </Select>
            )}

          </Section>
        ))}

        <Button type="button" onClick={addQuestion}>+ Savol qo‘shish</Button>
        <br /><br />
        <Button onClick={handleSubmit}>Yuborish (Part {activePart})</Button>
      </Column>
    </PageWrapper>
  )
}

export default ReadingAdmin
