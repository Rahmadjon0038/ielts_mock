import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { getNotify } from "./notify";
const notify = getNotify()
// --------------------- add month ----------------
const addMonth = async (addMonthData) => {
    const response = await instance.post('/api/mock/add', addMonthData);
    return response.data;
};

export const useaddMonth = () => {
    const queryClient = useQueryClient(); // <
    const addMonthMuation = useMutation({
        mutationFn: addMonth,
        onSuccess: (data) => {
            notify('ok', 'new month added')
            queryClient.invalidateQueries({ queryKey: ['montmock'] });
        },
        onError: (error) => {
            console.log(error)
            notify('err', error?.response?.data?.msg || 'Already available this month');

        }
    })
    return addMonthMuation
}

// --------------------- get month ----------------


const getMonth = async () => {
    const response = await instance.get('/api/mock/get')
    return response.data
};
export const usegetMonth = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['montmock'],
        queryFn: getMonth,
    })

    return { data, isLoading, error, refetch }
};

// --------------------- get month  id----------------
const getMontId = async (id) => {
    const response = await instance.get(`/api/mock/get/${id}`)
    return response.data
};
export const usegetMontId = (id) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['montmock', id],
        queryFn: () => getMontId(id),
    })

    return { data, isLoading, error, refetch }
};

// --------------------- del month ----------------
const deleteMonth = async (id) => {
    const response = await instance.delete(`/api/mock/delete/${id}`);
    return response.data;
};

export const usedeleteMonth = () => {
    const queryClient = useQueryClient();
    const deleteMonthMuation = useMutation({
        mutationFn: deleteMonth,
        onSuccess: (data) => {
            notify('ok', data.msg)
            queryClient.invalidateQueries({ queryKey: ['montmock'] });
        },
        onError: (error) => {
            console.log(error)
            notify('err', error?.response?.data?.msg || 'month not found');

        }
    })
    return deleteMonthMuation
}
