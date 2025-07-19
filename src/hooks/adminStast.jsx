import { useQuery } from '@tanstack/react-query';
import { instance } from './api'


const getAdminStast = async ({ queryKey }) => {
  const [_key, params] = queryKey;
  const { id } = params;
  const res = await instance.get(`/api/mock/admin/month-stats/${id}`)
  return res.data;
};

export const usegetAdminStast = (params) => {
  return useQuery({
    queryKey: ['stast', params],
    queryFn: getAdminStast,
    enabled: !!params?.id, 
    staleTime: 5 * 60 * 1000, 
    cacheTime: 10 * 60 * 1000, 
  });
};

