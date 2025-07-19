  import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
  import { instance } from "./api";
  import { getNotify } from "./notify";
  const notify = getNotify();


  // --------------------- Add Writing (Admin) ----------------
  const addWritingAdmin = async (id, formData) => {
    const response = await instance.post(`/api/mock/${id}/writing/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  export const useAddWritingAdmin = (id) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (formData) => addWritingAdmin(id, formData), // ✅ id tashqaridan kelmoqda
      onSuccess: (data) => {
        notify("ok", data.msg);
        queryClient.invalidateQueries({ queryKey: ["writing-admin", id] });
      },
      onError: (error) => {
        console.log(error, 'xatolik');
        // notify("err", error?.response?.data?.msg || "Already available this month");
      },
    });
  };


  // --------------------- Get Writing (Admin) ----------------
  const getWritingAdmin = async (id) => {
    const response = await instance.get(`/api/mock/${id}/writing/get`);
    return response.data;
  };

  export const useGetWritingAdmin = (id) => {
    return useQuery({
      queryKey: ["writing-admin", id],
      queryFn: () => getWritingAdmin(id),
      enabled: !!id,
    });
  };

  // --------------------- Get User Writing Answers (Admin) ----------------
  const getWritingAnswerMonthAdmin = async ({ monthid, userid }) => {
    const response = await instance.get(`/api/mock/writing/answers/${monthid}/${userid}`);
    return response.data;
  };

  export const useGetWritingAnswerMonthAdmin = ({ monthid, userid }) => {
    return useQuery({
      queryKey: ["writing-answers-admin", monthid, userid],
      queryFn: () => getWritingAnswerMonthAdmin({ monthid, userid }),
      enabled: !!monthid && !!userid,
    });
  };

  // --------------------- Get Writing Answer Users (Users list) ----------------
  const getWritingAnswerMonthUsers = async (monthid) => {
    const response = await instance.get(`/api/mock/users/${monthid}/users`);
    return response.data;
  };

  export const useGetWritingAnswerMonthUsers = (monthid) => {
    return useQuery({
      queryKey: ["writing-users", monthid],
      queryFn: () => getWritingAnswerMonthUsers(monthid),
      enabled: !!monthid,
    });
  };




  // --------------------- ser Writing Answer adminga yuborishi) ----------------
  const setWritingAnswer = async (data) => {
    const response = await instance.post(`/api/mock/writing/submit`, data);
    return response.data;
  };

  export const usesetWritingAnswer = () => {
    const queryClient = useQueryClient();
    const setAnswerWriting = useMutation({
      mutationFn: setWritingAnswer,
      onSuccess: (data) => {
        // notify("ok", data.msg);
        console.log(data)
        queryClient.invalidateQueries({ queryKey: ["writing-user-answer"] });
      },
      onError: (error) => {
        console.log(error)
        // notify("err", error?.response?.data?.msg || "Already available this month");
      },
    });
    return setAnswerWriting
  };


  // ----------------------------- RAITINGS qaysi oyga qatnashganini bilishi uchun -------------------------

  const getUserMonthAnswer = async (userId) => {
    const response = await instance.get(`/api/user/participated-months/${userId}`);
    return response.data;
  };

  export const useGetAllUsersRatingsMonth = (id) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ['month-raitings', id],
      queryFn: () => getUserMonthAnswer(id),
      enabled: !!id
    });

    return { data, isLoading, error };
  };

  // ----------------------------- RAITINGS USER HAMMA BOLIMLARINI BAXOSINI KORISHI -------------------------

  const getAlluserRatings = async ({ queryKey }) => {
    const [_key, { monthId, userId }] = queryKey;

    const response = await instance.get(`/api/mock/writing/getallraitings/${monthId}/${userId}`);
    return response.data;
  }

  export const useGetAllusersRatings = ({ monthId, userId }) => {
    const { data, isLoading, error } = useQuery({
      queryKey: ['raitings', { monthId, userId }],
      queryFn: getAlluserRatings,
      enabled: !!monthId && !!userId
    });

    return { data, isLoading, error };
  };


  // ------------------------------- userlarni baxolash ------------------------------------

  const assessment = async (data) => {
    const { comment, score, section, paramdata: { id, userid } } = data
    const response = await instance.post(`/api/mock/writing/setraitings/${id}/${userid}`, { comment, score, section });
    return response.data;
  };

  export const useAassessment = () => {
    const queryClient = useQueryClient();
    const setAassessment = useMutation({
      mutationFn: assessment,
      onSuccess: (data) => {
        notify("ok", data.msg);
        queryClient.invalidateQueries({ queryKey: ["raitings"] });
        queryClient.invalidateQueries({ queryKey: ['stast'] })
      },
      onError: (error) => {
        console.log(error)
        // notify("err", error?.response?.data?.msg || "Already available this month");
      },
    });
    return setAassessment
  };
