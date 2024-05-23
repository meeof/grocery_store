import * as models from "../models.js";
import ErrorTemp from "../errors/errorsTemplate.js";
const findOneRating = async (userId, itemId) => {
    return await models.Rating.findOne({
        attributes: ['rate'],
        where: {
            userId,
            itemId
        },
    });
}

class RatingController {
    async getRatingForUser (req, res) {
        try {
            const {itemId} = req.query;
            const userId = req.params.userId;
            if (itemId && userId) {
                const rateObj = await findOneRating(userId, itemId);
                rateObj ? res.json(rateObj.dataValues.rate) : res.json(0)
            }
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async getRating (req, res) {
        try {
            const {itemId} = req.query;
            if (itemId) {
                const ratings = await models.Rating.findAndCountAll({
                    attributes: ['rate'],
                    where: {
                        itemId
                    },
                })
                const sumRating = ratings.rows.reduce(
                    (accumulator, rating) => accumulator + rating.dataValues.rate,
                    0,
                );
                ratings.count ? res.json((sumRating/ratings.count).toFixed(1)) : res.json(0);
            }
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
    async setRatings (req, res) {
        try {
            const {rate, userId, itemsId} = req.body;
            await Promise.all(itemsId.map(async itemId => {
                const rateExist = await findOneRating(userId, itemId);
                if (rateExist) {
                    return await models.Rating.update(
                        {rate},
                        {
                            where: {
                                userId,
                                itemId
                            },
                        }
                    );
                }
                else {
                    return await models.Rating.create(
                        {rate, userId, itemId},
                        {fields: ['rate', 'userId', 'itemId']});
                }
            }));
            res.json('success');
        } catch (err) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new RatingController()