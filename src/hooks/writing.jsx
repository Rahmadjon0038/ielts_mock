import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { instance } from "./api";
import { getNotify } from "./notify";
const notify = getNotify();


// --------------------- Add Writing (Admin) ----------------
const addWritingAdmin = async ({ id, task1, task2 }) => {
  const response = await instance.post(`/api/mock/${id}/writing/add`, { task1, task2 });
  return response.data;
};

export const useAddWritingAdmin = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => addWritingAdmin(data),
    onSuccess: (data) => {
      notify("ok", data.msg);
      queryClient.invalidateQueries({ queryKey: ["writing-admin", id] });
    },
    onError: (error) => {
      notify("err", error?.response?.data?.msg || "Already available this month");
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
