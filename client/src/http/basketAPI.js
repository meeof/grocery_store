import {$authHost} from "./http";
import {divideQueryString} from "../usefulFunctions";
export const addBasketItem = async (body) => {
    const {data} = await $authHost.post('/api/basket', body);
    return data
}
export const getOneBasketItemAmount = async (userId, itemId) => {
    let queryStr = '';
    if (userId && itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
        const {data} = await $authHost.get(`/api/basket${queryStr}`);
        return data
    }
}
export const getAllBasketItems = async (userId) => {
    const {data} = await $authHost.get(`/api/basket/${userId}`);
    return data
}
export const deleteBasketItem = async (userId, itemId) => {
    let queryStr = '';
    if (itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
    }
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    const {data} = await $authHost.delete(`/api/basket${queryStr}`);
    return data
}
export const getContacts = async (userId) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    const {data} = await $authHost.get(`/api/basket/orderContacts${queryStr}`);
    return data
}
export const createOrder = async (body) => {
    const {data} = await $authHost.post('/api/basket/formOrder', body);
    return data
}
export const getOrders = async (userId, limit) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    if (limit) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'limit=' + limit;
    }
    const {data} = await $authHost.get(`/api/basket/orders${queryStr}`);
    return data
}