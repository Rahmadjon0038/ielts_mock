import { useQuery } from '@tanstack/react-query'
import { instance } from './api'

const getHome = async () => {
    const response = await instance.get('/')
    return response.data
};


export const useGetHome = () => {
    const { data, isLoading, error } = useQuery({
        queryFn: getHome,
        queryKey: ['user'],
    })
    return { data, isLoading, error }
};
