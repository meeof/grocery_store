import {$authHost, $host} from "./http";

const divideQueryString = (str) => {
    if (str.length === 0) {
        return str += '?'
    }
    else {
        return str += '&'
    }
}

export const createCategory = async (body) => {
    const {data} = await $authHost.post('/api/categories', body);
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
export const fetchAllItems = async (categoryId, limit) => {
    let queryStr = '';
    if (categoryId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'catId=' + categoryId;
    }
    if (limit) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'limit=' + limit;
    }
    const {data} = await $host.get(`/api/item${queryStr}`);
    return data;
}
export const fetchOneItem = async (id) => {
    const {data} = await $host.get(`/api/item/${id}`);
    return data
}

