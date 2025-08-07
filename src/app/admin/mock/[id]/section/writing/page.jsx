'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { GlobalContainer,TextBlock } from '@/globalStyle'
import Loader from '@/components/loader/Loader'
import { Card, Form, Message, TaskTitle, Button, Input, Images } from './style'
import { useAddWritingAdmin, useGetWritingAdmin } from '@/hooks/writing'

function WritingPage() {
  const { id, sectionId } = useParams()
  const { data, isLoading, refetch } = useGetWritingAdmin(id)
  const addWritingAdminMutation = useAddWritingAdmin(id)
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  const [task1, setTask1] = useState('')
  const [task2, setTask2] = useState('')
  const [task1Image, setTask1Image] = useState(null)
  const [task2Image, setTask2Image] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('task1', task1)
    formData.append('task2', task2)

    if (task1Image) {
      formData.append('task1Image', task1Image)
    }
    if (task2Image) {
      formData.append('task2Image', task2Image)
    }

    addWritingAdminMutation.mutate(formData, {
      onSuccess: () => {
        setTask1('')
        setTask2('')
        setTask1Image(null)
        setTask2Image(null)
        refetch() 
      }
    })
  }

  if (isLoading) return <Loader />

  return (
    <div style={{minHeight:'100vh'}}>
      <GlobalContainer>
      <h1>{sectionId}</h1>
      <h2 style={{ marginBottom: '20px' }}>📄 Writing assignments</h2>

      {data?.task1 && data?.task2 ? (
        <Card>
          <TaskTitle>Task 1</TaskTitle>
          <TextBlock>{data.task1}</TextBlock>
          {data.task1_image && (
            <Images
              src={`${baseUrl}/uploads/${data.task1_image}`}
              alt="Task 1"
              style={{ maxWidth: '100%', marginTop: '1rem' }}
            />
          )}

          <TaskTitle style={{ marginTop: '2rem' }}>Task 2</TaskTitle>
          <TextBlock>{data.task2}</TextBlock>
          {data.task2_image && (
            <Images
              src={`${baseUrl}/uploads/${data.task2_image}`}
              alt="Task 2"
              style={{ maxWidth: '100%', marginTop: '1rem' }}
            />
          )}
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

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTask1Image(e.target.files[0])}
          style={{ margin: '1rem 0' }}
        />

        <Input
          placeholder="Task 2 text..."
          value={task2}
          onChange={(e) => setTask2(e.target.value)}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setTask2Image(e.target.files[0])}
          style={{ margin: '1rem 0' }}
        />

        <Button type="submit">Save</Button>
      </Form>
    </GlobalContainer>
    </div>
  )
}

export default WritingPage
