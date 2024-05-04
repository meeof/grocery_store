import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import * as path from 'path';
import __dirname from "../__dirname.js";
import { v4 as uuidv4 } from 'uuid';
import {deleteSpace} from "../usefulFunctions.js";
import {Op} from "sequelize";
class ItemController {
    async create(req, res) {
        try {
            let {name, price, discount, categoryId, info} = req.body;
            name = deleteSpace(name);
            if (name === '') {
                res.json('Некорректное имя товара');
            } else if (Number(price) < 0 || Number(price) > 1000000000) {
                    res.json('Некорректная цена товара');
            } else if (Number(discount) < 0 || Number(discount) > 100) {
                res.json('Некорректная скидка %');
            } else {
                const itemExist = await models.Item.findOne({
                    where: {
                        name: name
                    },
                });
                if (itemExist) {
                    res.json('Товар с таким именем уже существует');
                }
                else {
                    let imgNames = null;
                    if (req?.files) {
                        try {
                            for (let key in req.files) {
                                if (!imgNames) {
                                    imgNames = [];
                                }
                                const imgName = uuidv4() + '.jpg';
                                imgNames.push(imgName);
                                await req.files[key].mv(`${path.resolve(__dirname, 'static', imgName)}`)
                            }
                        } catch (error) {
                        }
                    }
                    const newItem = await models.Item.create(
                        {
                            name, price: Number(price), discount: Number(discount),
                            images: imgNames !== null ? JSON.stringify(imgNames) : null, categoryId
                        },
                        {fields: ['name', 'price', 'discount', 'images', 'categoryId']});
                    for (let obj of JSON.parse(info)) {
                        if (deleteSpace(obj.title) === '' || deleteSpace(obj.description) === '') {
                            continue
                        }
                        const newItemInfo = await models.ItemInfo.create(
                            {title: obj.title, description: obj.description, itemId: newItem.dataValues.id},
                            {fields: ['title', 'description', 'itemId']}
                        )
                    }
                    res.json(newItem.dataValues);
                }
            }
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async update(req, res) {
        try {
            let {id, name, price, discount, categoryId, info} = req.body;
            let itemFields = {};
            if (name || name === '') {
                name = deleteSpace(name);
                const nameExist = await models.Item.findOne({
                    where: {
                        id: {[Op.not]: id},
                        name: name
                    },
                });
                if (nameExist) {
                    return ErrorTemp.badRequest(res, 'Товар с таким именем уже существует');
                }
                else if (name === '') {
                    return ErrorTemp.badRequest(res, 'Некорректное имя товара');
                }
                else {
                    itemFields.name = name;
                }
            }
            if (price) {
                if (Number(price) < 0 || Number(price) > 1000000000) {
                    return ErrorTemp.badRequest(res, 'Некорректная цена товара')
                }
                else {
                    itemFields.price = Number(price)
                }
            }
            if (discount) {
                if (Number(discount) < 0 || Number(discount) > 100) {
                    return ErrorTemp.badRequest(res, 'Некорректная скидка %');
                }
                else {
                    itemFields.discount = Number(discount)
                }
            }
            if (categoryId) {
                const categoryExist = await models.Categories.findOne({
                    where: {
                        id: categoryId
                    },
                });
                if (categoryExist) {
                    itemFields.categoryId = Number(categoryId)
                }
                else {
                    ErrorTemp.badRequest(res, 'Некорректная категория товара')
                }
            }
            if (req?.files) {
                let imgNames = null;
                try {
                    for (let key in req.files) {
                        if (!imgNames) {
                            imgNames = [];
                        }
                        const imgName = uuidv4() + '.jpg';
                        imgNames.push(imgName);
                        await req.files[key].mv(`${path.resolve(__dirname, 'static', imgName)}`)
                    }
                } catch (error) {
                }
                imgNames !== null && (itemFields.images = JSON.stringify(imgNames))
            }
            if (info) {
                await models.ItemInfo.destroy({
                    where: {
                        itemId: id,
                    },
                });
                for (let obj of JSON.parse(info)) {
                    if (deleteSpace(obj.title) === '' || deleteSpace(obj.description) === '') {
                        continue
                    }
                    const newItemInfo = await models.ItemInfo.create(
                        {title: obj.title, description: obj.description, itemId: id},
                        {fields: ['title', 'description', 'itemId']}
                    )
                }
            }
            await models.Item.update(
                itemFields,
                {
                    where: {
                        id: id,
                    },
                }
            );
            res.json('success');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async delete(req, res) {
        try {
            const {itemId} = req.query;
            await models.ItemInfo.destroy({
                where: {
                    itemId: itemId,
                },
            });
            await models.Item.destroy({
                where: {
                    id: itemId,
                },
            });
            res.json('delete success');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getAll(req, res) {
        try {
            let {catId, limit, page} = req.query;
            page = page || 1;
            limit = limit || 4;
            let offset = limit * (page - 1);
            let where = {};
            catId ? where = {'categoryId': catId} : {};
            const allItems = await models.Item.findAndCountAll({
                attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId'],
                where, limit, offset, order: [
                    ['id', 'DESC'],
                ],
            })
            allItems.rows.map(item => {
                if (item.dataValues.images === null) {
                    item.dataValues.images = [];
                }
                else {
                    item.dataValues.images = JSON.parse(item.dataValues.images);
                }
            })
            res.json(allItems);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getOne(req, res) {
        try {
            const oneItem = await models.Item.findOne({
                attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId'],
                where: {
                    id: req.params.id
                }
            });
            const itemInfos = await models.ItemInfo.findAll({
                attributes: ['id', 'title', 'description'],
                where: {
                    itemId: req.params.id
                }
            })
            const frontResponse = {
                ...oneItem.dataValues,
                images: oneItem.images? JSON.parse(oneItem.images) : [],
                info: itemInfos.map(itemInfo => itemInfo.dataValues)
            };
            res.json(frontResponse);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new ItemController();