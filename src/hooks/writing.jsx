import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { getNotify } from "./notify";
const notify = getNotify()

// --------------------- add writing admin ----------------

const addWritingAdmin = async (addWritingAdminData) => {
    const { id, task1, task2 } = addWritingAdminData
    const response = await instance.post(`/api/mock/${id}/writing/add`, { task1, task2 });
    return response.data;
};

export const useaddWritingAdmin = (id) => {
    const queryClient = useQueryClient(); // <
    const addWritingAdminMuation = useMutation({
         mutationFn: (addWritingAdminData) => addWritingAdmin(addWritingAdminData),
        onSuccess: (data) => {
            console.log(data)
            notify('ok', data.msg)
            queryClient.invalidateQueries({ queryKey: ['writing',id] });
        },
        onError: (error) => {
            console.log(error)
            notify('err', error?.response?.data?.msg || 'Already available this month');
        }
    })
    return addWritingAdminMuation
}


// --------------------- get writing admin ----------------

    
const getWritingAdmin = async (id) => {
    const response = await instance.get(`/api/mock/${id}/writing/get`)
    return response.data
};
export const usegetWritingAdmin = (id) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['writing', id],
        queryFn: () => getWritingAdmin(id),
    })

    return { data, isLoading, error, refetch }
};
