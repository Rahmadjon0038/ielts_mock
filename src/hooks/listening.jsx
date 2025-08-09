import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { getNotify } from "./notify";
const notify = getNotify()
// --------------------- add month ----------------
// ➕ Javoblarni yuborish
const addListeningAnswers = async (answersData) => {
    const response = await instance.post('/api/listening/addanswer', answersData);
    return response.data;
};

export const useAddListeningAnswers = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addListeningAnswers,
        onSuccess: (data, vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
            notify('ok', 'Javoblar muvaffaqiyatli saqlandi');
            queryClient.invalidateQueries({ queryKey: ['listeningAnswers'] });
        },
        onError: (error) => {
            console.log(error);
            notify('err', error?.response?.data?.message || 'Xatolik yuz berdi');
        }
    });

    return mutation;
};

// 📥 Javoblarni olish
const getListeningAnswers = async ({ userId, monthId }) => {
    const response = await instance.get(`/api/listening/getanswer/${monthId}/${userId}`);
    return response.data;
};

export const useGetListeningAnswers = ({ userId, monthId }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['listeningAnswers', userId, monthId],
        queryFn: () => getListeningAnswers({ userId, monthId }),
        enabled: !!userId && !!monthId // faqat userId va monthId mavjud bo'lsa ishlaydi
    });

    return { data, isLoading, error, refetch };
};
