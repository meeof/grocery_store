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
export const getOneItem = async (id) => {
    return await models.Item.findOne({
        attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId', 'userId'],
        where: {
            id,
        }
    });
}
export const getUserInfo = async (userId) => {
    return await models.UserInfo.findOne({
        where: {
            userId,
        },
    });
}

export const getWasBought = async (userId, itemId, table) => {
    const check = await table.findOne({
        attributes: ['id'],
        where: {
            userId,
            itemId,
        }
    })
    return !!check;
}
export const checkBoughtReviewed = async (userId, itemId, field) => {
    let table;
    switch (field) {
        case 'bought':
            table = models.WasBought;
            break
        case 'reviewed':
            table = models.Reviews;
            break
    }
    const check = await table.findOne({
        attributes: ['id'],
        where: {
            userId,
            itemId,
        }
    })
    return !!check;
}
export const verifySeller = async (table, userId, id) => {
    const check = await table.findOne({
        attributes: ['userId'],
        where: {
            id
        }
    });
    return userId === check.dataValues.userId;
}