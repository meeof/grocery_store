import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {checkCategoryExist, deleteSpace, getOneItem, saveImages} from "../usefulFunctions.js";
import {Op} from "sequelize";
import {sequelize} from "../db.js";

const getItems = async (categoryId, limit, page, find) => {
    page = page || 1;
    limit = limit || 4;
    const offset = limit * (page - 1);
    const where = {};
    categoryId && (where.categoryId = categoryId);
    find && (where.name = {[Op.iRegexp]: find});
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
    return allItems
}
class ItemController {
    async createUpdate(req, res) {
        try {
            let {id, name, price, discount, categoryId, categoryName, info} = req.body;
            const itemFields = {};
            if (typeof name === 'string') {
                name = deleteSpace(name);
                const where = {name};
                id && (where.id = {[Op.not]: id});
                const nameExist = await models.Item.findOne({
                    where,
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
            if (typeof price === 'string') {
                if (Number(price) < 0 || Number(price) > 1000000) {
                    return ErrorTemp.badRequest(res, 'Некорректная цена товара')
                }
                else {
                    itemFields.price = Number(price)
                }
            }
            if (typeof discount === 'string') {
                if (Number(discount) < 0 || Number(discount) > 100) {
                    return ErrorTemp.badRequest(res, 'Некорректная скидка %');
                }
                else {
                    itemFields.discount = Number(discount)
                }
            }
            if (typeof categoryId === 'string') {
                const categoryExist = checkCategoryExist(categoryName);
                if (categoryExist) {
                    itemFields.categoryId = Number(categoryId)
                }
                else {
                    return ErrorTemp.badRequest(res, 'Некорректная категория товара')
                }
            }
            if (req?.files) {
                const images = await saveImages(req.files, true);
                itemFields.images = JSON.stringify(images);
            }
            let response = '';
            await sequelize.transaction(async () => {
                if (id) {
                    await models.Item.update(
                        itemFields,
                        {
                            where: {
                                id: id,
                            },
                        }
                    );
                }
                else {
                    const created = await models.Item.create(
                        itemFields, {fields: ['name', 'price', 'discount', 'images', 'categoryId']},
                    );
                    response = created.dataValues.name;
                }
                if (typeof info === 'string') {
                    await sequelize.transaction(async () => {
                        id && await models.ItemInfo.destroy({
                            where: {
                                itemId: id,
                            },
                        });
                        for (const {title, description} of JSON.parse(info)) {
                            if (deleteSpace(title) === '' || deleteSpace(description) === '') {
                                continue
                            }
                            await models.ItemInfo.create(
                                {title, description, itemId: id},
                                {fields: ['title', 'description', 'itemId']}
                            )
                        }
                    })
                }
            })
            res.json(response);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async delete(req, res) {
        try {
            await sequelize.transaction(async () => {
                const {id} = req.query;
                await models.ItemInfo.destroy({
                    where: {
                        itemId: id,
                    },
                });
                await models.Item.destroy({
                    where: {
                        id,
                    },
                });
            })
            res.json('deleted');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getAll(req, res) {
        try {
            let {categoryId, limit, page, find} = req.query;
            const allItems = await getItems(categoryId, limit, page, find);
            res.json(allItems);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getOne(req, res) {
        try {
            const {id} = req.query;
            const response =  await sequelize.transaction(async () => {
                const oneItem = await getOneItem(id);
                const itemInfos = await models.ItemInfo.findAll({
                    attributes: ['id', 'title', 'description'],
                    where: {
                        itemId: id,
                    }
                })
                return  {
                    ...oneItem.dataValues,
                    images: oneItem.images? JSON.parse(oneItem.images) : [],
                    info: itemInfos.map(itemInfo => itemInfo.dataValues)
                };
            });
            res.json(response);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new ItemController();