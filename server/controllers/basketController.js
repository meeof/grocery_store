import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {Op} from "sequelize";

const getBasketId = async (userId) => {
    const basket = await models.Basket.findOne({
        attributes: ['id', 'userId'],
        where: {
            userId
        }
    })
    return basket.dataValues.id
}
const getAllBasketItems = async (basketId) => {
    return await models.BasketItem.findAll({
        attributes: ['id', 'amount', 'itemId'],
        where: {
            basketId,
            itemId: {[Op.not]: null},
            amount: {[Op.gt]: 0},
        }
    });
}

class BasketController {
    async addItem (req, res) {
        try {
            const {userId, itemId, amount} = req.body;
            const basketId = await getBasketId(userId);
            const update = await models.BasketItem.update(
                {amount},
                {
                    where: {
                        basketId,
                        itemId,
                    }
                }
            )
            if (!update[0]) {
                const newBasketItem = await models.BasketItem.create(
                    {
                        amount,
                        basketId,
                        itemId,
                    },
                    {fields: ['amount', 'basketId', 'itemId']});
            }
            res.json('success');
        } catch (err) {
            ErrorTemp.err(res);
        }
    }
    async getOneAmount (req, res) {
        try {
            const {userId, itemId} = req.query;
            const basketId = await getBasketId(userId);
            const oneBasketItem = await models.BasketItem.findOne({
                attributes: ['amount'],
                where: {
                    basketId,
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
            const basketId = await getBasketId(req.params.userId);
            const allBasketItems = await getAllBasketItems(basketId);
            const response = await Promise.all(allBasketItems.map(async (item) => {
                const oneItem = await models.Item.findOne({
                    attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId'],
                    where: {
                        id: item.dataValues.itemId,
                    }
                });
                return {
                    basketId: item.dataValues.id,
                    amount: item.dataValues.amount,
                    itemId: item.dataValues.itemId,
                    name: oneItem.dataValues.name,
                    cost: Math.round(oneItem.dataValues.price/100 * (100 - oneItem.dataValues.discount)),
                    image: JSON.parse(oneItem.dataValues.images)[0],
                    categoryId: oneItem.dataValues.categoryId,
                    userId: req.params.userId,
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
            const basketId = await getBasketId(userId);
            await models.BasketItem.destroy({
                where: {
                    itemId,
                    basketId
                },
            });
            res.json('delete success');
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async getContacts (req, res) {
        try {
            const {userId} = req.query;
            const contacts = await models.UserInfo.findOne({
                attributes: ['name', 'surname', 'phone'],
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
            let {name, surname, phone, point, delivery, address, comment, sms, userId} = req.body;
            const basketId = await getBasketId(userId);
            const allBasketItems = await getAllBasketItems(basketId);
            const items = await Promise.all(allBasketItems.map(async (item) => {
                const oneItem = await models.Item.findOne({
                    attributes: ['id', 'name', 'price', 'discount', 'images'],
                    where: {
                        id: item.dataValues.itemId,
                    }
                });
                return {
                    basketItemId: item.dataValues.id,
                    itemId: oneItem.dataValues.id,
                    amount: item.dataValues.amount,
                    name: oneItem.dataValues.name,
                    cost: Math.round(oneItem.dataValues.price/100 * (100 - oneItem.dataValues.discount)),
                    img: JSON.parse(oneItem.dataValues.images)[0],
                }
            }));
            const fullPrice = items.reduce(
                (accumulator, item) => accumulator + item.cost * item.amount,
                0,
            );
            const dateDelivery = new Date();
            dateDelivery.setDate(dateDelivery.getDate() + 5);
            const newOrder = await models.Orders.create(
                {name, surname, phone, point, delivery, address, comment, sms, basketId,
                    items: JSON.stringify(items), full_price: fullPrice, status: 'В обработке', delivery_date: dateDelivery},
                {fields: ['name', 'surname', 'phone', 'point', 'delivery',
                        'address', 'comment', 'sms', 'basketId', 'items', 'full_price', 'status', 'delivery_date']});
            for (const item of items) {
                const  del = await models.BasketItem.destroy({
                    where: {
                        id: item.basketItemId,
                        basketId
                    },
                });
            }
            res.json('success');
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async getOrders(req, res) {
        try {
            const basketId = await getBasketId(req.query.userId);
            const limit = req.query.limit;
            const orders = await models.Orders.findAll({
                attributes: ['id', 'name', 'surname', 'phone', 'point', 'delivery', 'address', 'comment', 'sms', 'full_price',
                'items', 'status', 'delivery_date', 'createdAt'],
                where: {
                    basketId,
                },
                limit: limit ? limit : 3,
            });
            res.json(orders);
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
}
export default new BasketController()