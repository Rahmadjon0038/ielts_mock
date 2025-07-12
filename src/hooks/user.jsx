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
