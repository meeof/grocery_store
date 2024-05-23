import {$authHost, $host} from "./http";
import {divideQueryString} from "../usefulFunctions";

export const getRating = async (itemId) => {
    let queryStr = '';
    if (itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
    }
    const {data} = await $host.get(`/api/rating/${queryStr}`);
    return data
}
export const getRatingForUser = async (itemId, userId) => {
    let queryStr = '';
    if (itemId) {
        queryStr = divideQueryString(queryStr);
        queryStr += 'itemId=' + itemId;
    }
    const {data} = await $authHost.get(`/api/rating/${userId}${queryStr}`);
    return data
}
export const setRatings = async (body) => {
    const {data} = await $authHost.post('/api/rating', body);
    return data
}