import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {Op} from "sequelize";
import {sequelize} from "../db.js";
import {v4 as uuidv4} from "uuid";
import path from "path";
import __dirname from "../__dirname.js";
import {getUserInfo} from "./userController.js";

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
const wasReviewed = async (userId, itemId) => {
    const check = await sequelize.query(
        `SELECT EXISTS (SELECT id FROM public.reviews WHERE "userId" = ${userId} and "itemId" = ${itemId} );`
    )
    return check[0][0].exists
}
class WasBought {
    async getWasBought(userId, itemId) {
        const check = await sequelize.query(
            `SELECT EXISTS (SELECT id FROM public.was_boughts WHERE "userId" = ${userId} and "itemId" = ${itemId} );`
        )
        return check[0][0].exists
    }
    async setWasBought (userId, itemId){
        await models.WasBought.create(
            {
                userId,
                itemId,
            },
            {fields: ['userId', 'itemId']});
    }
}

export const wasBought = new WasBought();
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
                    image: oneItem.dataValues.images ? JSON.parse(oneItem.dataValues.images)[0] : null,
                    categoryId: oneItem.dataValues.categoryId,
                    userId: req.query.userId,
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
            await models.BasketItem.destroy({
                where: {
                    itemId,
                    userId
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
    async formFastOrder(req, res) {
        try {
            let {name, surname, phone, point, delivery, address, comment, sms, userId, itemId} = req.body;
            const item = await getOneItem(itemId, 1, null);
            const dateDelivery = new Date();
            dateDelivery.setDate(dateDelivery.getDate() + 5);
            const newOrder = await models.Orders.create(
                {name, surname, phone, point, delivery, address, comment, sms, userId,
                    items: JSON.stringify([item]), full_price: item.cost, status: 'В обработке', delivery_date: dateDelivery},
                {fields: ['name', 'surname', 'phone', 'point', 'delivery',
                        'address', 'comment', 'sms', 'userId', 'items', 'full_price', 'status', 'delivery_date']});
            const firstTime = await wasBought.getWasBought(userId, itemId);
            if (!firstTime) {
                await wasBought.setWasBought(userId, itemId);
            }
            res.json('success');
        } catch (err) {
            console.log("\x1b[35m", err, "\x1b[0m")
            ErrorTemp.badRequest(res)
        }
    }
    async formBasketOrder(req, res){
        try {
            let {name, surname, phone, point, delivery, address, comment, sms, userId} = req.body;
            const allBasketItems = await getAllBasketItems(userId);
            const items = await Promise.all(allBasketItems.map(async (item) => {
                const firstTime = await wasBought.getWasBought(userId, item.dataValues.itemId);
                if (!firstTime) {
                    await wasBought.setWasBought(userId, item.dataValues.itemId);
                }
                return getOneItem(item.dataValues.itemId, item.dataValues.amount, item.dataValues.id);
            }));
            const fullPrice = items.reduce(
                (accumulator, item) => accumulator + item.cost * item.amount,
                0,
            );
            const dateDelivery = new Date();
            dateDelivery.setDate(dateDelivery.getDate() + 5);
            const newOrder = await models.Orders.create(
                {name, surname, phone, point, delivery, address, comment, sms, userId,
                    items: JSON.stringify(items), full_price: fullPrice, status: 'В обработке', delivery_date: dateDelivery},
                {fields: ['name', 'surname', 'phone', 'point', 'delivery',
                        'address', 'comment', 'sms', 'userId', 'items', 'full_price', 'status', 'delivery_date']});
            for (const item of items) {
                const  del = await models.BasketItem.destroy({
                    where: {
                        id: item.basketItemId,
                        userId
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
            const {userId} = req.query;
            const limit = req.query.limit;
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
                {basketId: null},
                {
                    where: {
                        userId,
                    }
                }
            )
            res.json('success');
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async bought (req, res) {
        try {
            const {userId, itemId} = req.query;
            let bought = false;
            if (userId && itemId) {
                bought = await wasBought.getWasBought(userId, itemId)
            }
            res.json(bought);
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async reviewed (req, res) {
        try {
            const {userId, itemId} = req.query;
            let reviewed = false;
            if (userId && itemId) {
                reviewed = await wasReviewed(userId, itemId)
            }
            res.json(reviewed);
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async addReview (req, res) {
        try {
            const {userId, itemId, review} = req.body;
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
            await models.Reviews.create(
                {userId, itemId, review, images: JSON.stringify(imgNames)},
            {fields: ['userId', 'itemId', 'review', 'images']});
            res.json('success')
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async getReviews (req, res) {
        try {
            const {itemId} = req.query;
            const reviews = await models.Reviews.findAll({
                attributes: ['id', 'userId', 'review', 'images', "createdAt", "updatedAt"],
                where: {
                    itemId
                },
                order: [
                    ["createdAt", 'ASC'],
                ],
            });
            const reviewsAndUsersInfos = await Promise.all(reviews.map(async (review) => {
                const {userId} = review.dataValues;
                try {
                    const userInfo = await getUserInfo(userId);
                    review.dataValues.name = userInfo.name;
                    review.dataValues.surname = userInfo.surname;
                    review.dataValues.img = userInfo.img;
                    if (review.dataValues.images) {
                        review.dataValues.images = JSON.parse(review.dataValues.images)
                    }
                } catch (err) {
                    review.dataValues.name = 'Пользователь удален';
                    review.dataValues.surname = '';
                    review.dataValues.img = null;
                    review.dataValues.images = [];
                }
                return review.dataValues;
            }))
            res.json(reviews);
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async deleteReview(req, res) {
        try {
            await models.Reviews.destroy({
                where: {
                    id: req.query.id
                },
            });
            res.json('success');
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async updateReview(req, res){
        try {
            const {id, review} = req.body;
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
            let fields = {};
            if (review) {
                fields.review = review;
            }
            if (imgNames) {
                fields.images = JSON.stringify(imgNames);
            }
            await models.Reviews.update(
                fields,
                {
                    where: {
                        id: id,
                    },
                }
            );
            res.json('success');
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
}

export default new BasketController()