import {$authHost, $host} from "./http";
import {divideQueryString} from "../usefulFunctions";

export const createCategory = async (body) => {
    const {data} = await $authHost.post('/api/categories', body);
    return data
}
export const deleteCategory = async (id) => {
    let queryStr = '';
    if (id) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'catId=' + id;
    }
    const {data} = await $authHost.delete(`/api/categories${queryStr}`);
    return data
}
export const updateCategory = async (body) => {
    const {data} = await $authHost.patch(`/api/categories`, body);
    return data
}
export const fetchCategories = async () => {
    const {data} = await $host.get('/api/categories');
    return data
}
export const createItem = async (body) => {
    const {data} = await $authHost.post('/api/item', body);
    return data;
}
export const updateItem = async (body) => {
    const {data} = await $authHost.patch('/api/item', body);
    return data;
}
export const deleteItem = async (id) => {
    let queryStr = '';
    if (id) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + id;
    }
    const {data} = await $authHost.delete(`/api/item${queryStr}`);
    return data
}
export const fetchAllItems = async (categoryId, limit, page, find) => {
    let queryStr = '';
    if (categoryId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'catId=' + categoryId;
    }
    if (limit) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'limit=' + limit;
    }
    if (page) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'page=' + page;
    }
    if (find) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'find=' + find;
    }
    const {data} = await $host.get(`/api/item${queryStr}`);
    return data;
}
export const fetchOneItem = async (id) => {
    const {data} = await $host.get(`/api/item/${id}`);
    return data
}
export const bought = async (userId, itemId) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    if (itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
    }
    const {data} = await $host.get(`/api/basket/bought${queryStr}`);
    return data;
}
export const reviewed = async (userId, itemId) => {
    let queryStr = '';
    if (userId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'userId=' + userId;
    }
    if (itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
    }
    const {data} = await $host.get(`/api/basket/reviewed${queryStr}`);
    return data;
}
export const addReview = async (body) => {
    const {data} = await $authHost.post('/api/basket/review', body);
    return data;
}
export const fetchReviews = async (itemId) => {
    let queryStr = '';
    if (itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
    }
    const {data} = await $host.get(`/api/basket/reviews${queryStr}`);
    return data;
}
