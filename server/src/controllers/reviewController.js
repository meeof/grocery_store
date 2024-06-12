import {checkBoughtReviewed, getUserInfo, getWasBought, saveImages} from "../usefulFunctions.js";
import ErrorTemp from "../errors/errorsTemplate.js";
import * as models from "../models.js";

class ReviewController {
    async check (req, res) {
        try {
            const {userId, itemId, field} = req.query;
            const bought = await checkBoughtReviewed(userId, itemId, field);
            res.json(bought);
        } catch (err) {
            ErrorTemp.badRequest(res);
        }
    }
    async addUpdateReview (req, res) {
        try {
            const {id, userId, itemId, review} = req.body;
            let fields = {};
            let images = null;
            if (req?.files) {
                images = await saveImages(req.files, true);
            }
            review && (fields.review = review);
            images && (fields.images = JSON.stringify(images))
            if (id) {
                await models.Reviews.update(
                    fields,
                    {
                        where: {
                            id: id,
                        },
                    }
                );
            }
            else {
                fields.userId = userId;
                fields.itemId = itemId;
                await models.Reviews.create(
                    fields,
                    {fields: ['userId', 'itemId', 'review', 'images']});
            }
            res.json('success');
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
            await Promise.all(reviews.map(async (review) => {
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
}
export default new ReviewController()