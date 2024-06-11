import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {Op} from "sequelize";
import {sequelize} from "../db.js";
import {checkBoughtReviewed, getWasBought} from "../usefulFunctions.js";

const getAllBasketItems = async (userId) => {
    return await models.BasketItem.findAll({
        attributes: ['id', 'amount', 'itemId'],
        where: {
            userId,
            itemId: {[Op.not]: null},
            amount: {[Op.gt]: 0},
        }
    });
}
const getOneItem = async (itemId, amount, basketItemId) => {
    const oneItem = await models.Item.findOne({
        attributes: ['id', 'name', 'price', 'discount', 'images', "categoryId"],
        where: {
            id: itemId,
        }
    });
    return {
        basketItemId: basketItemId,
        categoryId: oneItem.categoryId,
        itemId: oneItem.dataValues.id,
        amount,
        name: oneItem.dataValues.name,
        cost: Math.round(oneItem.dataValues.price/100 * (100 - oneItem.dataValues.discount)),
        img: oneItem.dataValues.images ? JSON.parse(oneItem.dataValues.images)[0] : null,
    }
}
const deleteBasketItem = async (userId, itemId) => {
    await models.BasketItem.destroy({
        where: {
            itemId,
            userId
        },
    });
};
const setWasBought = async (userId, itemId) => {
    await models.WasBought.create(
        {
            userId,
            itemId,
        },
        {fields: ['userId', 'itemId']});
}
class BasketController {
    async addItem (req, res) {
        try {
            const {userId, itemId, amount} = req.body;
            const update = await models.BasketItem.update(
                {amount},
                {
                    where: {
                        userId,
                        itemId,
                    }
                }
            )
            if (!update[0]) {
                await models.BasketItem.create(
                    {
                        amount,
                        userId,
                        itemId,
                    },
                    {fields: ['amount', 'userId', 'itemId']});
            }
            res.json('success');
        } catch (err) {
            ErrorTemp.err(res);
        }
    }
    async getOneAmount (req, res) {
        try {
            const {userId, itemId} = req.query;
            const oneBasketItem = await models.BasketItem.findOne({
                attributes: ['amount'],
                where: {
                    userId,
                    itemId,
                }
            });
            res.json(oneBasketItem.dataValues.amount);
        } catch (err) {
            res.json(null)
        }
    }
    async getAll (req, res) {
        try {
            const {userId} = req.query;
            const allBasketItems = await getAllBasketItems(userId);
            const response = await Promise.all(allBasketItems.map(async (item) => {
                const oneItem = await getOneItem(item.dataValues.itemId);
                return {
                    basketId: item.dataValues.id,
                    amount: item.dataValues.amount,
                    itemId: item.dataValues.itemId,
                    name: oneItem.name,
                    cost: oneItem.cost,
                    image: oneItem.img ? oneItem.img : null,
                    categoryId: oneItem.categoryId,
                    userId,
                }
            }));
            res.json(response);
        }
        catch (err) {
            ErrorTemp.err(res);
        }
    }
    async deleteItem (req, res) {
        try {
            const {userId, itemId} = req.query;
            await deleteBasketItem(userId, itemId);
            res.json('deleted');
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async getContacts (req, res) {
        try {
            const {userId} = req.query;
            const contacts = await models.UserInfo.findOne({
                attributes: ['name', 'surname'],
                where: {
                    userId
                }
            });
            res.json(contacts.dataValues);
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async formOrder(req, res){
        try {
            const checkFirstBuy = async (userId, itemId) => {
                const firstBuy = await checkBoughtReviewed(userId, itemId, 'bought');
                if (!firstBuy) {
                    await setWasBought(userId, itemId);
                }
            }
            const {name, surname, phone, point, delivery, address, comment, sms, userId, itemId} = req.body;
            const dateDelivery = new Date();
            dateDelivery.setDate(dateDelivery.getDate() + 5);
            let items = [];
            let fullPrice = 0;
            await sequelize.transaction(async () => {
                if (itemId) {
                    const item = await getOneItem(itemId, 1, null);
                    items.push(item);
                    fullPrice = item.cost;
                    await checkFirstBuy(userId, itemId);
                }
                else {
                    const allBasketItems = await getAllBasketItems(userId);
                    items = await Promise.all(allBasketItems.map(async (basketItem) => {
                        const item = await getOneItem(basketItem.dataValues.itemId, basketItem.dataValues.amount, basketItem.dataValues.id);
                        await checkFirstBuy(userId, basketItem.dataValues.itemId);
                        fullPrice += (item.cost * basketItem.dataValues.amount);
                        await deleteBasketItem(userId, basketItem.dataValues.itemId);
                        return item;
                    }));
                }
                await models.Orders.create(
                    {name, surname, phone, point, delivery, address, comment, sms, userId,
                        items: JSON.stringify(items), full_price: fullPrice, status: 'В обработке', delivery_date: dateDelivery},
                    {fields: ['name', 'surname', 'phone', 'point', 'delivery',
                            'address', 'comment', 'sms', 'userId', 'items', 'full_price', 'status', 'delivery_date']});
            });
            res.json('success');
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async getOrders(req, res) {
        try {
            const {userId, limit} = req.query;
            const orders = await models.Orders.findAndCountAll({
                attributes: ['id', 'name', 'surname', 'phone', 'point', 'delivery', 'address', 'comment', 'sms', 'full_price',
                'items', 'status', 'delivery_date', 'createdAt'],
                where: {
                    userId,
                },
                limit: limit ? limit : 3,
                order: [
                    ['id', 'DESC'],
                ],
            });
            res.json(orders);
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async clearOrders(req, res) {
        try {
            const {userId} = req.query;
            await models.Orders.update(
                {userId: null},
                {
                    where: {
                        userId,
                    }
                }
            )
            res.json('deleted');
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
}

export default new BasketController()