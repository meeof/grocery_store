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
export const addImagesToFormData = (formData, images) => {
    for (const [key, value] of Object.entries(images)) {
        formData.append(`${key}_${value.name}`, value)
    }
    return formData;
}
export const dateString = (createdAt, short) => {
    let options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC',
    }
    if (!short) {
        options = {...options, ...{
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }}
    }
    return new Date(createdAt).toLocaleString("eu", options);
}
