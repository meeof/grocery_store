import {$authHost, $host} from "./http";
import { jwtDecode } from "jwt-decode";

export const loginAPI = async (body) => {
    const {data} = await $host.post('/api/user/login', body);
    localStorage.setItem('token', data);
    return jwtDecode(data);
}
export const authAPI = async () => {
    const response = await $authHost.get('/api/user/auth');
    localStorage.setItem('token', response.data);
    return jwtDecode(response.data)
}