import * as models from "../models.js";
import ErrorTemp from "../errors/errorsTemplate.js";
const findOneRating = async (userId, itemId) => {
    const rating = await models.Rating.findOne({
        attributes: ['rate'],
        where: {
            userId,
            itemId
        },
    });
    return rating ? rating.dataValues.rate : 0;
}

class RatingController {
    async getRatingOneUser (req, res) {
        try {
            const {itemId} = req.query;
            const rate = await findOneRating(req.user.id, itemId);
            res.json(rate);
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
                        itemId,
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
            const {rate, itemsId} = req.body;
            await Promise.all(itemsId.map(async itemId => {
                const rateExist = await findOneRating(req.user.id, itemId);
                if (rateExist) {
                    return await models.Rating.update(
                        {rate},
                        {
                            where: {
                                userId: req.user.id,
                                itemId
                            },
                        }
                    );
                }
                else {
                    return await models.Rating.create(
                        {rate, userId: req.user.id, itemId},
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