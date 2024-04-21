import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {json, Op} from 'sequelize';

class CategoriesController {
    async create(req, res) {
        try {
            const {categoryName} = req.body;
            const newCategory = await models.Categories.create(
                {name: categoryName},
                {fields: ['name']});
            res.json(newCategory.dataValues);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getAll(req, res) {
        try {
            const categories = await models.Categories.findAll({
                attributes: ['id', 'name'],
            });
            for (let elem of categories) {
                let imageObj = await models.Item.findOne({
                    attributes: ['images'],
                    where: {
                        categoryId: elem.dataValues.id,
                        images: {[Op.not]: null},
                    },
                });
                if (imageObj?.dataValues.images) {
                    elem.dataValues.image = JSON.parse(imageObj?.dataValues.images)?.[0];
                }
                else {
                    elem.dataValues.image = null
                }
            }
            res.json(categories);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new CategoriesController();