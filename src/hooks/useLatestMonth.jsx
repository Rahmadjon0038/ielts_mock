// hooks/latestMonth.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { instance } from './api'
import { getNotify } from './notify'
import Cookies from 'js-cookie';
const notify = getNotify();
const getLatestMonth = async () => {
    const res = await instance.get('api/mock/getactivemonth')
    return res.data
}
export const useLatestMonth = () => {
    const { data, isLoading, error ,refetch} = useQuery({
        queryKey: ['latestMonth'],
        queryFn: getLatestMonth,
    })
    return { data, isLoading, error,refetch }
}

// --------------------- active id -----------------
const addActiveMontId = async (data) => {
    const res = await instance.post('api/mock/setactivemonth', data)
    return res.data
}
export const useAddActiveMonhId = () => {
    const queriClinet = useQueryClient();
    const activeAddMutation = useMutation({
        mutationFn: addActiveMontId,
        onSuccess: (data) => {
            notify('ok', data.msg)
            Cookies.set('activemonth', data?.mockId)
            queriClinet.invalidateQueries({ queryKey: ['latestMonth'] })

        },
        onError: (err) => {
            notify('ok', "error")
            console.log(err)
        }
    })
    return activeAddMutation
}