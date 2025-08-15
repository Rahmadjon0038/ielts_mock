import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { getNotify } from "./notify";
const notify = getNotify()




const getListeningMonths = async (monthId, userId) => {
    const response = await instance.get(`/api/listening/getmonths/${monthId}/${userId}`);
    return response.data;
};

export const useGetListeningMonths = ({ userId, monthId }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['listeningMonths', userId, monthId],
        queryFn: () => getListeningMonths(monthId, userId),
        enabled: !!userId && !!monthId // faqat userId va monthId mavjud bo'lsa ishlaydi
    });
    return { data, isLoading, error, refetch };
};





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


// --------------------- get audio ----------------

const getAudioListening = async (monthId) => {
    const response = await instance.get(`/api/audio/get/${monthId}`);
    return response.data;
};

export const useGetAudioListening = ({monthId }) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['audioListening', monthId],
        queryFn: () => getAudioListening(monthId),
        enabled: !!monthId // faqat userId va monthId mavjud bo'lsa ishlaydi
    });
    return { data, isLoading, error, refetch };
};


const addAudio = async (data) => {
    console.log(data,'salomat');
    const response = await instance.post('/api/audio/add', data);
    return response.data;
};

export const useAddAudio = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addAudio,
        onSuccess: (data, vars) => {
            console.log(data, 'Audio muvaffaqiyatli qo\'shildi');
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
            queryClient.invalidateQueries({ queryKey: ['audioListening'] });
        },
        onError: (error) => {
            console.log(error);
        }
    });

    return mutation;
};