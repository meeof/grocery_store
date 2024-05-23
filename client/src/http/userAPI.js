import {$authHost, $host} from "./http";
import { jwtDecode } from "jwt-decode";
import {divideQueryString} from "../usefulFunctions";

export const loginAPI = async (body) => {
    const {data} = await $host.post('/api/user/login', body);
    localStorage.setItem('token', data);
    return jwtDecode(data);
}
export const registrationAPI = async (body) => {
    const {data} = await $host.post('/api/user/registration', body);
    localStorage.setItem('token', data);
    return jwtDecode(data);
}
export const authAPI = async () => {
    const response = await $authHost.get('/api/user/auth');
    localStorage.setItem('token', response.data);
    return jwtDecode(response.data)
}
export const getUserInfo = async (userId) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    const {data} = await $authHost.get(`/api/user/info${queryStr}`);
    return data
}
export const updateUserInfo = async (body) => {
    const {data} = await $authHost.patch('/api/user/info', body);
    return data;
}
export const deleteUser = async (userId) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    const {data} = await $authHost.delete(`/api/user${queryStr}`);
    return data
}