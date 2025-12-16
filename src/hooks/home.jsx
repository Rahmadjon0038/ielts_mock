'use client'

import { useQuery } from "@tanstack/react-query"
import { instance } from "./api"

const getHomeTitle = async () => {
    const response = await instance.get('/')
    return response.data
}
export const useGetHome = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['home'],
        queryFn: getHomeTitle,
    })
    return { data, isLoading, error };
}