import {v4 as uuidv4} from "uuid";
import path from "path";
import __dirname from "./__dirname.js";

export const deleteSpace = (str) => {
    return str.replace(/^ +| +$/g, '');
}
export const saveImages = async (files, multiple) => {
    const imgNames = [];
    for (let key in files) {
        const name = uuidv4() + '.jpg';
        await files[key].mv(`${path.resolve(__dirname, 'static', name)}`);
        imgNames.push(name);
    }
    console.log(imgNames);
    if (multiple) {
        return imgNames;
    }
    else return imgNames[0];
}
