import { useQuery } from '@tanstack/react-query'
import { instance } from './api'
import Cookies from 'js-cookie'

const getUser = async () => {
    const response = await instance.get('/api/user/me')
    return response.data
};
export const usegetUser = () => {
    const token = Cookies.get('token')
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        enabled: !!token,
    })

    return { data, isLoading, error, refetch }
};


// ------------------------------------------------------------------------------------------------------------

const getReadingQuestion = async ({ queryKey }) => {
    const id = queryKey[1]  // ikkinchi element — bu sizning id
    const response = await instance.get(`/api/reading/get/${id}`)
    return response.data
}

export const useGetReadingQuestion = (id) => {
  const { data, isLoading, error } = useQuery({
    queryFn: getReadingQuestion,
    queryKey: ['reading', id],
    enabled: !!id, // Faqat id mavjud bo‘lsa ishlaydi
  })

  return { data, isLoading, error }
}
