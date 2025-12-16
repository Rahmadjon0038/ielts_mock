'use client'
import { useMutation,  useQueryClient } from "@tanstack/react-query"
import { instance } from "./api"
import { getNotify } from "./notify"
const notify = getNotify()

const addreadingTask = async (data) => {
    console.log('Yuborilayotgan ma’lumot:', data)
    const res = await instance.post('/api/reading/add', data)
    return res.data
}
export const useAddReadingTask = () => {
    const queriClinet = useQueryClient();
    const readingAdmuation = useMutation({
        mutationFn: addreadingTask,
        onSuccess: (data) => {
            notify('ok',data.message)
            queriClinet.invalidateQueries({ queryKey: ['reading'] })
        },
        onError: (err) => {
            console.log(err);
            notify('err','Error adding reading task')
        }
    })
    return readingAdmuation
}

