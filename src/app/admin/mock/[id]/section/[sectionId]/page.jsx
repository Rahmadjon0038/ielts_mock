'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { GlobalContainer } from '@/globalStyle'
import { useaddWritingAdmin, usegetWritingAdmin } from '@/hooks/writing'
import Loader from '@/components/loader/Loader'
import { Card, Form, Message, TaskTitle,Button, Input } from './style'



function WritingPage() {
  const { id } = useParams()
  const { data, isLoading, error, refetch } = usegetWritingAdmin(id)
  const addWritingAdminMuation = useaddWritingAdmin(id);

  const [task1, setTask1] = useState('')
  const [task2, setTask2] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    addWritingAdminMuation.mutate({ id, task1, task2 })
    setTask1('')
    setTask2('')
  }

  if (isLoading) {
    return <Loader />
  }
  return (
    <GlobalContainer>
      <h2 style={{ marginBottom: '20px' }}>📄 Writing assignments</h2>

      {data?.task1 && data?.task2 ? (
        <Card>
          <TaskTitle>Task 1</TaskTitle>
          <p>{data.task1}</p>
          <TaskTitle style={{ marginTop: '2rem' }}>Task 2</TaskTitle>
          <p>{data.task2}</p>
        </Card>
      ) : (
        <Message>No writing assignments have been created yet.</Message>
      )}

      <Form onSubmit={handleSubmit}>
        <h3>✍️ Enter new Writing assignments</h3>
        <Input
          placeholder="Task 1 text..."
          value={task1}
          onChange={(e) => setTask1(e.target.value)}
          required
        />
        <Input
          placeholder="Task 2 text..."
          value={task2}
          onChange={(e) => setTask2(e.target.value)}
          required
        />
        <Button type="submit" >
          Save
        </Button>
      </Form>
    </GlobalContainer>
  )
}

export default WritingPage
