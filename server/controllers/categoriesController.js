import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';

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
            res.json(categories);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new CategoriesController();