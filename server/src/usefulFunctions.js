import {v4 as uuidv4} from "uuid";
import path from "path";
import __dirname from "./__dirname.js";
import * as models from "./models.js";
import {Op} from "sequelize";
import {sequelize} from "./db.js";

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
    let attributes = ['id'];
    field === 'bought' && attributes.push('count');
    return await table.findOne({
        where: {
            userId,
            itemId,
        }
    })
}
export const verifyCreator = async (table, userId, id) => {
    const check = await table.findOne({
        attributes: ['userId'],
        where: {
            id
        }
    });
    return userId === check.dataValues.userId;
}
export const getItemInfo = async (itemId, title, content) => {
    let where = {};
    itemId && (where.itemId = itemId);
    title && (where.title = {[Op.iRegexp]: title});
    content && (where.content = {[Op.iRegexp]: content});
    return await models.ItemInfo.findAll({
        attributes: ['id', 'title', 'content', 'itemId'],
        where
    })
}
export const getItems = async (limit, favoritesIn, categoryId, page, find, field, filter) => {
    page = page || 1;
    limit = limit || 4;
    const offset = limit * (page - 1);
    const where = {};
    let order = [['id', 'DESC']];
    categoryId && (where.categoryId = categoryId);
    find && (where.name = {[Op.iRegexp]: find});
    if (filter) {
        if (filter.price) {
            where.price = {[Op.between]: [filter.price.minPrice, filter.price.maxPrice],}
        }
        if (filter.discount) {
            where.discount = {[Op.between]: [filter.discount.minDiscount, filter.discount.maxDiscount],}
        }
        if (filter.country || filter.color) {
            let itemIds = [];
            let colorIds = [];
            let countryIds = [];
            if (filter.country) {
                let itemInfos = await getItemInfo(null, 'страна', filter.country);
                itemInfos.forEach(itemInfo => {
                    countryIds.push(itemInfo.dataValues.itemId);
                })
            }
            if (filter.color) {
                const itemInfos = await getItemInfo(null, 'цвет', filter.color);
                itemInfos.forEach(itemInfo => {
                    colorIds.push(itemInfo.dataValues.itemId);
                })
            }
            if (filter.country && filter.color) {
                for (let itemId of colorIds) {
                    countryIds.includes(itemId) && itemIds.push(itemId)
                }
            }
            else if (filter.country) {
                itemIds = countryIds;
            }
            else if (filter.color) {
                itemIds = colorIds
            }
            where.id = {[Op.in]: itemIds}
        }
    }
    if (favoritesIn) {
        where.id = {[Op.in]: favoritesIn};
        let strOrderFavorites = '';
        for (let i= 0; i < favoritesIn.length; i++) {
            if (i === 0) {
                strOrderFavorites += `CASE\n`
            }
            strOrderFavorites += `WHEN id='${favoritesIn[i]}' THEN ${i+1}\n`
            if (i === favoritesIn.length - 1) {
                strOrderFavorites += 'END'
            }
        }
        strOrderFavorites && (order = [sequelize.literal(strOrderFavorites)]);
    }
    if (field === 'discount') {
        where.discount = {[Op.gte]: 30};
        order = [['discount', 'DESC']];
    }
    if (field === 'popular') {
        order = [['count', 'DESC']];
    }
    const allItems = await models.Item.findAndCountAll({
        attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId', 'userId', 'createdAt', 'count'],
        where, limit, offset, order
    })
    allItems.rows.map(item => {
        if (item.dataValues.images === null) {
            item.dataValues.images = [];
        }
        else {
            item.dataValues.images = JSON.parse(item.dataValues.images);
        }
    })
    return allItems
}