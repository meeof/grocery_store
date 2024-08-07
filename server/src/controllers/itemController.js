import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {
    checkCategoryExist,
    deleteSpace,
    getItemInfo,
    getItems,
    getOneItem,
    saveImages,
    verifyCreator
} from "../usefulFunctions.js";
import {Op} from "sequelize";
import {sequelize} from "../db.js";

class ItemController {
    async createUpdate(req, res) {
        try {
            let {id, name, price, discount, categoryId, categoryName, info} = req.body;
            const {role} = req.user;
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
            if (id && role === 'SELLER') {
                const verify = await verifyCreator(models.Item, req.user.id, id);
                if (!verify) return ErrorTemp.badRequest(res);
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
                    itemFields.userId = req.user.id;
                    const created = await models.Item.create(
                        itemFields, {fields: ['name', 'price', 'discount', 'images', 'categoryId', 'userId']},
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
                        for (const {title, content} of JSON.parse(info)) {
                            if (deleteSpace(title) === '' || deleteSpace(content) === '') {
                                continue
                            }
                            await models.ItemInfo.create(
                                {title, content, itemId: id},
                                {fields: ['title', 'content', 'itemId']}
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
            const {id} = req.query;
            const {role} = req.user;
            if (role === 'SELLER') {
                const verify = await verifyCreator(models.Item, req.user.id, id);
                if (!verify) return ErrorTemp.badRequest(res);
            }
            await sequelize.transaction(async () => {
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
            let {categoryId, limit, page, find, field, filter} = req.query;
            const allItems = await getItems(limit, null, categoryId, page, find, field, filter);
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
                const itemInfos = await getItemInfo(id);
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