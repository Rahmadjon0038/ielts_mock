'use client'

import { useQuery } from '@tanstack/react-query'
import { instance } from '@/hooks/api'

const getStudent = async () => {
  const response = await instance.get('/todos/1')
  return response.data
}

export const UseGetData = () => {
  const { data } = useQuery({
    queryKey: ['users'],
    queryFn: getStudent,
  })

  return { data }
}
