// hooks/latestMonth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from './api'
import { getNotify } from './notify'

const notify = getNotify();

const getUntied = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const { userId, monthId, section } = params;

  const res = await instance.get('api/untied/get', {
    params: { userId, monthId, section },
  });

  return res.data;
};

export const useGetUntied = (params) => {
  return useQuery({
    queryKey: ['untied', params],
    queryFn: getUntied,
    enabled: !!params?.userId && !!params?.monthId && !!params?.section, // faqat barcha kerakli data bo‘lsa
    staleTime: 5 * 60 * 1000, // 5 daqiqa: kechikmasdan refresh qilish uchun
    cacheTime: 10 * 60 * 1000, // 10 daqiqa: cache saqlansin
  });
};

// --------------------- active id -----------------
const addUntied = async (data) => {
    const res = await instance.post('api/untied/set', data)
    return res.data
}
export const useAddUntied = () => {
    const queriClinet = useQueryClient();
    const untiedmutation = useMutation({
        mutationFn: addUntied,
        onSuccess: (data) => {  
          console.log(data)
            queriClinet.invalidateQueries({ queryKey: ['untied'] })
        },
        onError: (err) => {
        }
    })
    return untiedmutation
}

