export const routePrefix = (prefix, id) => {
    return `${prefix}_${id}`
}
export const routeUnPrefix = (route) => {
    let routeArr = route.split('_');
    return Number(routeArr[routeArr.length - 1]);
}
export const getPriceDiscount = (price, discount) => {
    return Math.round(price / 100 * (100 - discount)).toFixed(0)
}
export const divideQueryString = (str) => {
    if (str.length === 0) {
        return str + '?'
    }
    else {
        return str + '&'
    }
}
