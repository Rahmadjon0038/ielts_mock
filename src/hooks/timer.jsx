'use client'
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { instance } from "./api"

const getTimer = async ({ queryKey }) => {
    const [_key, userId, section, monthId] = queryKey;
    const response = await instance.get(`/api/section-time/${userId}/${section}/${monthId}`);
    return response.data;
};

export const useGetTimer = (userId, section,monthId) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['timer', userId, section,monthId],
        queryFn: getTimer,
        enabled: !!userId && !!section && !!monthId // faqat userId va section bo‘lsa ishlaydi
    });

    return { data, isLoading, error };
};

// --------------------- Timer boshlnishi -----------------
const setTimer = async (data) => {
    const res = await instance.post('/api/section-time/start', data)
    return res.data
}
export const useAddtimer = () => {
    const queriClinet = useQueryClient();
    const timerMutation = useMutation({
        mutationFn: setTimer,
        onSuccess: (data) => {
            console.log(data)
            queriClinet.invalidateQueries({ queryKey: ['untied'] })
        },
        onError: (err) => {
            console.log(err);
        }
    })
    return timerMutation
}

