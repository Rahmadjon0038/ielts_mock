import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from './api'
import Cookies from 'js-cookie'
import { getNotify } from './notify';
const notify = getNotify()
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

const addReadingQuestion = async (data) => {
  // console.log(data,'salomat')
  const res = await instance.post('/api/reading/add', data)
  return res.data
}
export const useAddReadingQuestion = () => {
  const queriClinet = useQueryClient();
  const addReadingQuestionMutatin = useMutation({
    mutationFn: addReadingQuestion,
    onSuccess: (data) => {
      notify('ok',data?.message)
      console.log(data, '-----------------')
      queriClinet.invalidateQueries({ queryKey: ['reading'] })

    },
    onError: (err) => {
      console.log(err)
    }
  })
  return addReadingQuestionMutatin
}


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
