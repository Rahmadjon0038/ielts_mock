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
      notify('ok', data?.message)
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

// -------------------------------- reading answer admin uchun user javoblarini olish ------------------
// ✅ API chaqiruvi
const getUserReadingAnswer = async ({ queryKey }) => {
  const [_key, userId, monthId] = queryKey;
  const response = await instance.get(`/api/reading/answers?userId=${userId}&monthId=${monthId}`);
  return response.data;
};

// ✅ React Query bilan foydalanish

export const useGetUserReadingAnswer = (userId, monthId) => {

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['readingAnswers', userId, monthId],
    queryFn: getUserReadingAnswer,
    enabled: !!userId && !!monthId,
  });

  return { data, isLoading, error, refetch };
};

// -------------------  user javibini yuborishi -----------------------

const submitReadingAnswers = async (data) => {
  const response = await instance.post('/api/reading/sumbit', data);
  return response.data;
};

// 🔸 React Query mutation hook
export const useSubmitReadingAnswers = () => {

  const mutation = useMutation({
    mutationFn: submitReadingAnswers,
    onSuccess: (data, vars) => {
      notify('ok', data?.message)
      vars.onSucess(data)
    },
    onError: (err) => {
      console.log(err)
      notify('ok', data?.message || 'xatolik yuz berdi')
    }
  });

  return mutation;
};