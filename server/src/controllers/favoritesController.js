import * as models from "../models.js";
import ErrorTemp from "../errors/errorsTemplate.js";
import {getItems} from "../usefulFunctions.js";

const checkExists = async (userId, itemId) => {
    return await models.Favorites.findOne({
        attributes: ['id'],
        where: {
            userId, itemId
        }
    })
}
class FavoritesController {
    async get (req, res) {
        const {limit} = req.query;
        try {
            let favorites = await models.Favorites.findAll({
                attributes: ['itemId'],
                where: {
                    userId: req.user.id,
                }
            })
            favorites = favorites.map(row => row.dataValues.itemId).reverse();
            const items = await getItems(null, limit, null, null, favorites);
            res.json(items);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async add (req, res) {
        try {
            const {itemId} = req.body;
            const exists = await checkExists(req.user.id, itemId);
            if (exists) {
                return ErrorTemp.badRequest(res);
            }
            await models.Favorites.create(
                {itemId, userId: req.user.id},
                {fields: ['itemId', 'userId']});
            res.json('success');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async check (req, res) {
        try {
            const exists = await checkExists(req.user.id, req.query.itemId);
            res.json(!!exists);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async delete (req, res) {
        const {itemId} = req.query;
        try {
            await models.Favorites.destroy({
                where: {
                    userId: req.user.id, itemId
                },
            });
            res.json('deleted');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new FavoritesController();