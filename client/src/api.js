import axios from "axios";
import {jwtDecode} from "jwt-decode";

const templateAPI = async (host, method, path, params, decode) => {
    let data = null;
    switch (method) {
        case 'delete':
            data = (await host.delete(path, {params})).data
            break;
        case 'post':
            data = (await host.post(path, params)).data
            break;
        case 'patch':
            data = (await host.patch(path, params)).data
            break;
        default :
            data = (await host.get(path, {params})).data
    }
    if (decode) {
        localStorage.setItem('token', data);
        return jwtDecode(data);
    }
    else {
        return data;
    }
}
const $host = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})
const $authHost = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})
const authInterceptor = config => {
    const token = localStorage.getItem('token');
    config.headers.authorization = `Bearer ${token}`;
    return config;
}
$authHost.interceptors.request.use(authInterceptor)
export {
    $host,
    $authHost
}
export const authAPI = async (method, path, params) => {
    return await templateAPI($authHost, method, path, params)
}
export const API = async (method, path, params) => {
    return await templateAPI($host, method, path, params)
}
export const decodeAuthAPI = async (method, path, params) => {
    return await templateAPI($authHost, method, path, params, true)
}
export const authorization = async () => {
    const response = await $authHost.get('/api/user/auth');
    localStorage.setItem('token', response.data);
    return jwtDecode(response.data)
}