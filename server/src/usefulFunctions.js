import {v4 as uuidv4} from "uuid";
import path from "path";
import __dirname from "./__dirname.js";
import * as models from "./models.js";
import {Op} from "sequelize";

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
    if (multiple) {
        return imgNames;
    }
    else return imgNames[0];
}
export const checkCategoryExist = async (name, id) => {
    let where = {name};
    id && (where.id = {[Op.not]: id});
    return await models.Categories.findOne({
        where
    });
}
