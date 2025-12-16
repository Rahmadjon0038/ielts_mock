import { useMutation } from "@tanstack/react-query";
import { getNotify } from "./notify";
import Cookies from "js-cookie";
const notify = getNotify();
const { instance } = require("./api")

const register = async (registerData) => {
    const response = await instance.post('/api/auth/register', registerData);
    return response.data;
};

export const useRegister = () => {
    const registerMuation = useMutation({
        mutationFn: register,
        onSuccess: (data) => {
            console.log(data)
            notify('ok', data.msg)
        },
        onError: (error) => {
            notify('err', error.response.data.msg)
        }
    })
    return registerMuation
}
// --------------------- login ------------------------
const login = async (loginData) => {
    const response = await instance.post('/api/auth/login', loginData);
    return response.data;
};

export const uselogin = () => {
    const loginMuation = useMutation({
        mutationFn: login,
        onSuccess: (data,vars) => {
            if (vars.onSuccess) {
                vars.onSuccess(data)
            }
            notify('ok', data.msg)
            Cookies.set('token', data.token)
        },
        onError: (error) => {
            console.log(error)
            notify('err', error.response.data.msg)

        }
    })
    return loginMuation
}