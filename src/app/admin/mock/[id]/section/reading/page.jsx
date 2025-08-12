'use client'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import styled, { css } from 'styled-components'
import { useAddReadingTask } from '@/hooks/reading'
import { MdBorderLeft } from 'react-icons/md'

// --- Styled Components ---
const Wrapper = styled.div`
  margin: 40px auto;
  padding: 32px;
  background: #fff;
  border-radius: 12px;
  min-height: 100vh;
  `
const Passage = styled.div`
  background: #f5f5f5;
  padding: 18px 20px;
  border-radius: 8px;
  margin-bottom: 18px;
  font-size: 1.05rem;
  line-height: 1.7;
`
const QuestionBlock = styled.div`
  border-bottom: 1px solid #eee;
`
const Btn = styled.button`
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  white-space: nowrap;
  cursor: pointer;
  ${({ variant }) => variant === 'add' && css`
    background: #43a047;
    color: #fff;
    &:hover { background: #2e7d32; }
  `}
  ${({ variant }) => variant === 'remove' && css`
    background: #e53935;
    color: #fff;
    &:hover { background: #b71c1c; }
  `}
  ${({ variant }) => variant === 'submit' && css`
    background: #3949ab;
    color: #fff;
    &:hover { background: #283593; }
  `}
`
const TextInput = styled.input`
  padding: 10px 16px;
  border-radius: 7px;
  border: 1.5px solid #bdbdbd;
  width: 100%;
  font-size: 1rem;
  background: #fafdff;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
  &:focus {
    border: 1.5px solid #3949ab;
    outline: none;
    background: #f0f4ff;
  }
`
const LargeTextarea = styled.textarea`
  width: 100%;
  min-height: 400px;
  border-radius: 7px;
  border: 1.5px solid #bdbdbd;
  padding: 10px 16px;
  font-size: 1rem;
  background: #fafdff;
  margin-bottom: 18px;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
  resize: vertical;
  line-height: 30px;
  &:focus {
    border: 1.5px solid #3949ab;
    outline: none;
    background: #f0f4ff;
  }
`
const Table = styled.table`
  border-collapse: collapse;
  margin-bottom: 10px;
  width: 100%;
  th, td {
    border: 1px solid #bdbdbd;
    padding: 6px 10px;
    text-align: left;
  }
`
const TitleInput = styled.input`
  padding: 10px 20px;
  border-radius: 7px;
  border: 1.5px solid #bdbdbd;
  margin-bottom: 16px;
  width: 100%;
  font-size: 1.18rem;
  font-weight: 600;
  background: #fafdff;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
  &:focus {
    border: 1.5px solid #3949ab;
    outline: none;
    background: #f0f4ff;
  }
  @media (max-width: 600px) {
    font-size: 1.05rem;
    padding: 12px 10px;
  }
`
const IntroInput = styled.input`
  padding: 14px 18px;
  border-radius: 7px;
  border: 1.5px solid #bdbdbd;
  margin-bottom: 14px;
  width: 100%;
  font-size: 1.08rem;
  background: #fafdff;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
  &:focus {
    border: 1.5px solid #3949ab;
    outline: none;
    background: #f0f4ff;
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 10px 8px;
  }
`
const QuestionInput = styled.input`
  padding: 15px 18px;
  border-radius: 7px;
  border: 1.5px solid #bdbdbd;
  width: 100%;
  font-size: 1.13rem;
  background: #fafdff;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
  &:focus {
    border: 1.5px solid #3949ab;
    outline: none;
    background: #f0f4ff;
  }
  @media (max-width: 600px) {
    font-size: 0.98rem;
    padding: 10px 8px;
  }
`
const OptionInput = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1.2px solid #bdbdbd;
  width: 60%;
  font-size: 0.98rem;
  background: #fafdff;
  transition: border 0.2s;
  box-sizing: border-box;
  display: block;
  &:focus {
    border: 1.2px solid #3949ab;
    outline: none;
    background: #f0f4ff;
  }
  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.93rem;
    padding: 8px 6px;
  }
`
const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 18px;
`
const InlineGroup = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 10px;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
  }

  select{
    padding: 10px 16px;
    font-size: 16px;
    border-radius: 8px;
    background-color: white;
  }
`

function extractMultiFields(q) {
  const regex = /\[([^\]]*)\]/g
  let match, fields = []
  while ((match = regex.exec(q)) !== null) {
    fields.push(match[1])
  }
  return fields
}

function ReadingForm() {
  const params = useParams()
  const monthId = params.id

  // --- LocalStorage persistence key ---
  const storageKey = `readingFormSections_${monthId}`

  // --- Load from localStorage if exists ---
  const [sections, setSections] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch {
          return [{ part: 'part1', intro: '', textTitle: '', text: '', question: [] }]
        }
      }
    }
    return [{ part: 'part1', intro: '', textTitle: '', text: '', question: [] }]
  })

  // --- Save to localStorage on change ---
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(sections))
    }
  }, [sections, storageKey])

  // --- Section handlers ---
  const addSection = () => {
    setSections(sections => [
      ...sections,
      {
        part: `part${sections.length + 1}`,
        intro: '',
        textTitle: '',
        text: '',
        question: []
      }
    ])
  }
  const removeSection = idx => {
    setSections(sections => sections.filter((_, i) => i !== idx)
      .map((sec, i) => ({ ...sec, part: `part${i + 1}` }))
    )
  }
  const handleSectionChange = (idx, field, value) => {
    setSections(sections => sections.map((sec, i) => i === idx ? { ...sec, [field]: value } : sec))
  }

  // --- Question Block handlers ---
  const addQuestionBlock = (sectionIdx) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? { ...sec, question: [...sec.question, { questionTitle: '', questionIntro: '', questionsTask: [] }] }
      : sec
    ))
  }
  const removeQuestionBlock = (sectionIdx, blockIdx) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? { ...sec, question: sec.question.filter((_, j) => j !== blockIdx) }
      : sec
    ))
  }
  const handleQuestionBlockChange = (sectionIdx, blockIdx, field, value) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx ? { ...q, [field]: value } : q)
      }
      : sec
    ))
  }

  // --- QuestionsTask handlers ---
  const addTask = (sectionIdx, blockIdx, type = 'radio') => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: [
              ...q.questionsTask,
              type === 'radio'
                ? { type: 'radio', question: '', options: [''], answer: '' }
                : type === 'select'
                  ? { type: 'select', question: '', options: [''], answer: '' }
                  : type === 'text-multi'
                    ? { type: 'text-multi', question: '', answer: [] }  // options olib tashlandi
                    : { type: 'table', table: [{ label: '', rows: [{ question: '', answer: '' }] }] }
            ]
          }
          : q
        )
      }
      : sec
    ))
  }

  const removeTask = (sectionIdx, blockIdx, taskIdx) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? { ...q, questionsTask: q.questionsTask.filter((_, k) => k !== taskIdx) }
          : q
        )
      }
      : sec
    ))
  }
  const handleTaskChange = (sectionIdx, blockIdx, taskIdx, field, value) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx ? { ...t, [field]: value } : t)
          }
          : q
        )
      }
      : sec
    ))
  }

  // --- Radio/Select option handlers ---
  const handleOptionChange = (sectionIdx, blockIdx, taskIdx, optIdx, value) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx
              ? { ...t, options: t.options.map((o, l) => l === optIdx ? value : o) }
              : t
            )
          }
          : q
        )
      }
      : sec
    ))
  }
  const removeOption = (sectionIdx, blockIdx, taskIdx, optIdx) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx
              ? { ...t, options: t.options.filter((_, l) => l !== optIdx) }
              : t
            )
          }
          : q
        )
      }
      : sec
    ))
  }
  const addOption = (sectionIdx, blockIdx, taskIdx) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx
              ? { ...t, options: [...(t.options || []), ''] }
              : t
            )
          }
          : q
        )
      }
      : sec
    ))
  }

  // --- Table row handlers ---
  const handleTableRowChange = (sectionIdx, blockIdx, taskIdx, rowIdx, value) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx
              ? {
                ...t,
                table: t.table.map((tbl, tblIdx) => tblIdx === 0
                  ? { ...tbl, rows: tbl.rows.map((r, l) => l === rowIdx ? { ...r, question: value } : r) }
                  : tbl
                )
              }
              : t
            )
          }
          : q
        )
      }
      : sec
    ))
  }
  const handleTableRowAnswer = (sectionIdx, blockIdx, taskIdx, rowIdx, value) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx
              ? {
                ...t,
                table: t.table.map((tbl, tblIdx) => tblIdx === 0
                  ? { ...tbl, rows: tbl.rows.map((r, l) => l === rowIdx ? { ...r, answer: value } : r) }
                  : tbl
                )
              }
              : t
            )
          }
          : q
        )
      }
      : sec
    ))
  }
  const addTableRow = (sectionIdx, blockIdx, taskIdx) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => k === taskIdx
              ? {
                ...t,
                table: t.table.map((tbl, tblIdx) => tblIdx === 0
                  ? { ...tbl, rows: [...tbl.rows, { question: '', answer: '' }] }
                  : tbl
                )
              }
              : t
            )
          }
          : q
        )
      }
      : sec
    ))
  }

  // --- Multi-text answer handler ---
  const handleMultiTextAnswer = (sectionIdx, blockIdx, taskIdx, idx, value) => {
    setSections(sections => sections.map((sec, i) => i === sectionIdx
      ? {
        ...sec,
        question: sec.question.map((q, j) => j === blockIdx
          ? {
            ...q,
            questionsTask: q.questionsTask.map((t, k) => {
              if (k !== taskIdx) return t
              const fields = extractMultiFields(t.question)
              const arr = Array(fields.length).fill('').map((_, i) => t.answer?.[i] || '')
              arr[idx] = value
              return { ...t, answer: arr }
            })
          }
          : q
        )
      }
      : sec
    ))
  }

  // --- Submit ---
  let testNum = 1
  const getTestNum = () => testNum++

  const readingAdmuation = useAddReadingTask()

  const handleSubmit = e => {
    e.preventDefault()
    // --- Validation ---
    for (const [sIdx, section] of sections.entries()) {
      if (!section.textTitle.trim()) {
        alert(`Section ${sIdx + 1}: Title majburiy!`)
        return
      }
      if (!section.text.trim()) {
        alert(`Section ${sIdx + 1}: Passage matni majburiy!`)
        return
      }
      for (const [qIdx, qBlock] of section.question.entries()) {
        if (!qBlock.questionTitle.trim()) {
          alert(`Section ${sIdx + 1}, Block ${qIdx + 1}: Block sarlavhasi majburiy!`)
          return
        }
        for (const [tIdx, task] of qBlock.questionsTask.entries()) {
          if (['radio', 'select', 'text-multi'].includes(task.type) && !task.question.trim()) {
            alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}: Savol matni majburiy!`)
            return
          }
          if (task.type === 'radio' || task.type === 'select') {
            if (!task.options || !task.options.length || task.options.some(opt => !opt.trim())) {
              alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}: Barcha variantlar to'ldirilishi kerak!`)
              return
            }
            if (!task.answer || !task.answer.trim()) {
              alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}: To'g'ri javob majburiy!`)
              return
            }
          }
          if (task.type === 'text-multi') {
            const fields = extractMultiFields(task.question)
            if (!fields.length) {
              alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}: [ ] bilan maydonlar belgilang!`)
              return
            }
            if (!task.answer || task.answer.length !== fields.length || task.answer.some(a => !a.trim())) {
              alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}: Barcha javob maydonlari to'ldirilishi kerak!`)
              return
            }
          }
          if (task.type === 'table') {
            const rows = task.table?.[0]?.rows || []
            if (!rows.length) {
              alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}: Kamida bitta qator bo'lishi kerak!`)
              return
            }
            for (const [rIdx, row] of rows.entries()) {
              if (!row.question.trim()) {
                alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}, Qator ${rIdx + 1}: Qator savoli majburiy!`)
                return
              }
              if (!row.answer || !row.answer.trim()) {
                alert(`Section ${sIdx + 1}, Block ${qIdx + 1}, Savol ${tIdx + 1}, Qator ${rIdx + 1}: To'g'ri javob majburiy!`)
                return
              }
            }
          }
        }
      }
    }
    // Add number field to each question in the output
    let num = 1
    const sectionsWithNumbers = sections.map(section => ({
      ...section,
      question: section.question.map(qBlock => ({
        ...qBlock,
        questionsTask: qBlock.questionsTask.map(task => {
          if (task.type === 'text-multi') {
            const fields = extractMultiFields(task.question)
            const numbers = fields.map(() => num++)
            return { ...task, numbers }
          }
          if (task.type === 'table') {
            const rows = task.table?.[0]?.rows || []
            const numbers = rows.map(() => num++)
            const newTable = task.table.map(tbl => ({
              ...tbl,
              rows: tbl.rows.map((row, i) => ({
                ...row,
                number: numbers[i]
              }))
            }))
            return {
              ...task,
              numbers,
              table: newTable
            }
          }
          // radio, select
          return { ...task, number: num++ }
        })
      }))
    }))
    const data = {
      monthId: Number(monthId),
      sections: sectionsWithNumbers
    }
    // console.log('Yig‘ilgan ma’lumot:', data)
    readingAdmuation.mutate(data)
    alert('Ma’lumotlar console ga chiqarildi!')
  }

  // --- Render ---
  return (
    <Wrapper>
      <h2 style={{ marginBottom: '10px' }}>Reading Test Admin (Month ID: {monthId})</h2>
      <form onSubmit={handleSubmit}>
        {sections.map((section, sIdx) => (
          <div key={sIdx} style={{ border: '1px solid #e0e0e0', borderRadius: 8, marginBottom: 32, padding: 16 }}>
            <InlineGroup>
              <TextInput
                placeholder="Section part (auto)"
                value={section.part}
                readOnly
                style={{ background: '#f3f3f3', fontWeight: 600 }}
              />
              <Btn type="button" variant="remove" onClick={() => removeSection(sIdx)}>Remove Section</Btn>
            </InlineGroup>
            <FormGroup>
              <TitleInput
                placeholder="Section Title"
                value={section.textTitle}
                onChange={e => handleSectionChange(sIdx, 'textTitle', e.target.value)}
              />
              <IntroInput
                placeholder="Section Intro"
                value={section.intro}
                onChange={e => handleSectionChange(sIdx, 'intro', e.target.value)}
              />
            </FormGroup>
            <Passage>
              <LargeTextarea
                placeholder="Section Passage"
                value={section.text}
                onChange={e => handleSectionChange(sIdx, 'text', e.target.value)}
              />
            </Passage>
            <div style={{ fontWeight: 700, fontSize: 20, margin: '18px 0 8px 0', color: '#3949ab' }}>
              Section {sIdx + 1}
            </div>
            {section.question.map((qBlock, qIdx) => (
              <QuestionBlock key={qIdx}>
                <InlineGroup>
                  <TextInput
                    placeholder="Question Block Title"
                    value={qBlock.questionTitle}
                    onChange={e => handleQuestionBlockChange(sIdx, qIdx, 'questionTitle', e.target.value)}
                  />
                  <Btn type="button" variant="remove" onClick={() => removeQuestionBlock(sIdx, qIdx)}>Remove Block</Btn>
                </InlineGroup>
                <TextInput
                  placeholder="Question Block Intro"
                  value={qBlock.questionIntro}
                  onChange={e => handleQuestionBlockChange(sIdx, qIdx, 'questionIntro', e.target.value)}
                />
                <div style={{ fontWeight: 600, fontSize: 17, margin: '12px 0 8px 0', color: '#2e7d32' }}>
                  Block {qIdx + 1}
                </div>
                {qBlock.questionsTask.map((task, tIdx) => {
                  let localTestNumbers = []
                  if (task.type === 'text-multi') {
                    const fields = extractMultiFields(task.question)
                    localTestNumbers = fields.map(() => getTestNum())
                  } else if (task.type === 'table') {
                    localTestNumbers = (task.table?.[0]?.rows || []).map(() => getTestNum())
                  } else {
                    localTestNumbers = [getTestNum()]
                  }
                  return (
                    <div key={tIdx} style={{ border: '1px solid #e3e3e3', borderRadius: 6, margin: '12px 0', padding: 10 }}>
                      <InlineGroup>
                        <select
                          value={task.type}
                          onChange={e => handleTaskChange(sIdx, qIdx, tIdx, 'type', e.target.value)}
                        >
                          <option value="radio">Radio</option>
                          <option value="select">Select</option>
                          <option value="text-multi">Multi Text</option>
                          <option value="table">Table</option>
                        </select>
                        <Btn type="button" variant="remove" onClick={() => removeTask(sIdx, qIdx, tIdx)}>Remove</Btn>
                      </InlineGroup>
                      {task.type === 'radio' && (
                        <>
                          <div style={{ margin: '10px 0 6px 0', display: 'flex', alignItems: 'center', }}>
                            <b style={{ border: '1px solid #434343', padding: 14, borderRadius: 4, marginRight: 4 }}>{localTestNumbers[0]}</b>{' '}
                            <QuestionInput
                              placeholder="Radio Question"
                              value={task.question}
                              onChange={e => handleTaskChange(sIdx, qIdx, tIdx, 'question', e.target.value)}
                            />
                          </div>
                          {(task.options || []).map((opt, optIdx) => (
                            <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '10px' }}>
                              <OptionInput
                                placeholder={`Option ${optIdx + 1}`}
                                value={opt}
                                onChange={e => handleOptionChange(sIdx, qIdx, tIdx, optIdx, e.target.value)}
                              />
                              <Btn type="button" variant="remove" onClick={() => removeOption(sIdx, qIdx, tIdx, optIdx)}>Delete</Btn>
                            </div>
                          ))}
                          <Btn type="button" variant="add" onClick={() => addOption(sIdx, qIdx, tIdx)}>Add Option</Btn>
                          <div style={{ marginTop: 8 }}>
                            <TextInput
                              placeholder="Correct Answer"
                              value={task.answer || ''}
                              onChange={e => handleTaskChange(sIdx, qIdx, tIdx, 'answer', e.target.value)}
                            />
                            <span style={{ color: '#888', fontSize: 14 }}>To‘g‘ri javob</span>
                          </div>
                        </>
                      )}
                      {task.type === 'select' && (
                        <>
                          <div style={{ margin: '10px 0 6px 0', display: 'flex', alignItems: 'center' }}>
                            <b style={{ border: '1px solid #434343', padding: 14, borderRadius: 4, marginRight: 4 }}>{localTestNumbers[0]}</b>{' '}
                            <QuestionInput
                              placeholder="Select Question"
                              value={task.question}
                              onChange={e => handleTaskChange(sIdx, qIdx, tIdx, 'question', e.target.value)}
                            />
                          </div>
                          {(task.options || []).map((opt, optIdx) => (
                            <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '10px' }}>
                              <OptionInput
                                placeholder={`Option ${optIdx + 1}`}
                                value={opt}
                                onChange={e => handleOptionChange(sIdx, qIdx, tIdx, optIdx, e.target.value)}
                              />
                              <Btn type="button" variant="remove" onClick={() => removeOption(sIdx, qIdx, tIdx, optIdx)}>Delete</Btn>
                            </div>
                          ))}
                          <Btn type="button" variant="add" onClick={() => addOption(sIdx, qIdx, tIdx)}>Add Option</Btn>
                          <div style={{ marginTop: 8 }}>
                            <TextInput
                              placeholder="Correct Answer"
                              value={task.answer || ''}
                              onChange={e => handleTaskChange(sIdx, qIdx, tIdx, 'answer', e.target.value)}
                            />
                            <span style={{ color: '#888', fontSize: 14, marginTop: '10px' }}>To‘g‘ri javob (variant matni bilan)</span>
                          </div>
                        </>
                      )}
                      {task.type === 'text-multi' && (
                        <>
                          <div>
                            <QuestionInput
                              style={{ width: '80%' }}
                              placeholder="Multi Text Question (use [] for fields)"
                              value={task.question}
                              onChange={e => handleTaskChange(sIdx, qIdx, tIdx, 'question', e.target.value)}
                            />
                          </div>
                          {extractMultiFields(task.question).map((field, idx) => (
                            <div key={idx}>
                              <div style={{ margin: '10px 0 6px 0', display: 'flex', alignItems: 'center' }}>
                                <b style={{ border: '1px solid #434343', padding: 8, borderRadius: 4, marginRight: 4 }}>{localTestNumbers[idx]}</b>{' '}
                                <TextInput
                                  placeholder={`Correct answer for field ${idx + 1}`}
                                  value={task.answer?.[idx] || ''}
                                  onChange={e => handleMultiTextAnswer(sIdx, qIdx, tIdx, idx, e.target.value)}
                                />
                              </div>
                              <span style={{ color: '#888', fontSize: 13 }}>To‘g‘ri javob</span>
                            </div>
                          ))}
                        </>
                      )}
                      {task.type === 'table' && (
                        <>
                          <div style={{ marginBottom: 6 }}>
                            <TextInput
                              placeholder="Table Label (optional)"
                              value={task.table?.[0]?.label || ''}
                              onChange={e => {
                                setSections(sections => sections.map((sec, i) => i === sIdx
                                  ? {
                                    ...sec,
                                    question: sec.question.map((q, j) => j === qIdx
                                      ? {
                                        ...q,
                                        questionsTask: q.questionsTask.map((t, k) => k === tIdx
                                          ? {
                                            ...t,
                                            table: t.table.map((tbl, tblIdx) => tblIdx === 0
                                              ? { ...tbl, label: e.target.value }
                                              : tbl
                                            )
                                          }
                                          : t
                                        )
                                      }
                                      : q
                                    )
                                  }
                                  : sec
                                ))
                              }}
                            />
                          </div>
                          <Table>
                            <thead>
                              <tr>
                                <th>Event</th>
                                <th>Correct Answer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(task.table?.[0]?.rows || []).map((row, rowIdx) => (
                                <tr key={rowIdx}>
                                  <td>
                                    <TextInput
                                      placeholder="Row Question"
                                      value={row.question}
                                      onChange={e => handleTableRowChange(sIdx, qIdx, tIdx, rowIdx, e.target.value)}
                                    />
                                  </td>
                                  <td>
                                    <TextInput
                                      placeholder="Correct Answer"
                                      value={row.answer || ''}
                                      onChange={e => handleTableRowAnswer(sIdx, qIdx, tIdx, rowIdx, e.target.value)}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <Btn type="button" variant="add" onClick={() => addTableRow(sIdx, qIdx, tIdx)}>Add Row</Btn>
                        </>
                      )}
                    </div>
                  )
                })}
                <InlineGroup>
                  <Btn type="button" variant="add" onClick={() => addTask(sIdx, qIdx, 'radio')}>Add Radio</Btn>
                  <Btn type="button" variant="add" onClick={() => addTask(sIdx, qIdx, 'select')}>Add Select</Btn>
                  <Btn type="button" variant="add" onClick={() => addTask(sIdx, qIdx, 'text-multi')}>Add Multi Text</Btn>
                  <Btn type="button" variant="add" onClick={() => addTask(sIdx, qIdx, 'table')}>Add Table</Btn>
                </InlineGroup>
              </QuestionBlock>
            ))}
            <Btn type="button" variant="add" onClick={() => addQuestionBlock(sIdx)}>Add Question Block</Btn>
          </div>
        ))}
        <InlineGroup>
          <Btn type="button" variant="add" onClick={addSection}>Add Section</Btn>
          <Btn type="submit" variant="submit">Submit</Btn>
        </InlineGroup>
      </form>
    </Wrapper>
  )
}

export default ReadingForm