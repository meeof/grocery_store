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
export const createBasketOrder = async (body) => {
    const {data} = await $authHost.post('/api/basket/formBasketOrder', body);
    return data
}
export const createFastOrder = async (body) => {
    const {data} = await $authHost.post('/api/basket/formFastOrder', body);
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
export const clearOrders = async (userId) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    const {data} = await $authHost.delete(`/api/basket/clearOrders${queryStr}`);
    return data
}
export const deleteReview = async (id) => {
    let queryStr = '';
    if (id) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'id=' + id;
    }
    const {data} = await $authHost.delete(`/api/basket/review${queryStr}`);
    return data
}
export const updateReview = async (body) => {
    const {data} = await $authHost.patch(`/api/basket/review`, body);
    return data
}