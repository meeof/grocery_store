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
    if (oneItem) {
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
    else return null;
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
            const {itemId, amount} = req.body;
            const update = await models.BasketItem.update(
                {amount},
                {
                    where: {
                        userId: req.user.id,
                        itemId,
                    }
                }
            )
            if (!update[0]) {
                await models.BasketItem.create(
                    {
                        amount,
                        userId: req.user.id,
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
            const {itemId} = req.query;
            const oneBasketItem = await models.BasketItem.findOne({
                attributes: ['amount'],
                where: {
                    userId: req.user.id,
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
            const allBasketItems = await getAllBasketItems(req.user.id);
            const response = await Promise.all(allBasketItems.map(async (item) => {
                const oneItem = await getOneItem(item.dataValues.itemId);
                if (oneItem) {
                    return {
                        basketId: item.dataValues.id,
                        amount: item.dataValues.amount,
                        itemId: item.dataValues.itemId,
                        name: oneItem.name,
                        cost: oneItem.cost,
                        image: oneItem.img ? oneItem.img : null,
                        categoryId: oneItem.categoryId,
                        userId: req.user.id,
                    }
                }
                else return null
            }));
            res.json(response.filter(item => item));
        }
        catch (err) {
            ErrorTemp.err(res);
        }
    }
    async deleteItem (req, res) {
        try {
            const {itemId} = req.query;
            await deleteBasketItem(req.user.id, itemId);
            res.json('deleted');
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async getContacts (req, res) {
        try {
            const contacts = await models.UserInfo.findOne({
                attributes: ['name', 'surname'],
                where: {
                    userId: req.user.id,
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
            const {name, surname, phone, point, delivery, address, comment, sms, itemId} = req.body;
            const dateDelivery = new Date();
            dateDelivery.setDate(dateDelivery.getDate() + 5);
            let items = [];
            let fullPrice = 0;
            await sequelize.transaction(async () => {
                if (itemId) {
                    const item = await getOneItem(itemId, 1, null);
                    items.push(item);
                    fullPrice = item.cost;
                    await checkFirstBuy(req.user.id, itemId);
                }
                else {
                    const allBasketItems = await getAllBasketItems(req.user.id);
                    items = await Promise.all(allBasketItems.map(async (basketItem) => {
                        const item = await getOneItem(basketItem.dataValues.itemId, basketItem.dataValues.amount, basketItem.dataValues.id);
                        await checkFirstBuy(req.user.id, basketItem.dataValues.itemId);
                        fullPrice += (item.cost * basketItem.dataValues.amount);
                        await deleteBasketItem(req.user.id, basketItem.dataValues.itemId);
                        return item;
                    }));
                }
                await models.Orders.create(
                    {name, surname, phone, point, delivery, address, comment, sms, userId: req.user.id,
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
            const {limit} = req.query;
            const orders = await models.Orders.findAndCountAll({
                attributes: ['id', 'name', 'surname', 'phone', 'point', 'delivery', 'address', 'comment', 'sms', 'full_price',
                'items', 'status', 'delivery_date', 'createdAt'],
                where: {
                    userId: req.user.id,
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
            await models.Orders.update(
                {userId: null},
                {
                    where: {
                        userId: req.user.id,
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