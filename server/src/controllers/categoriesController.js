import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {Op} from 'sequelize';
import {checkCategoryExist, deleteSpace} from "../usefulFunctions.js";

class CategoriesController {
    async createUpdate(req, res) {
        try {
            let {id, categoryName} = req.body;
            categoryName = deleteSpace(categoryName)
            if (categoryName === '') {
                return ErrorTemp.badRequest(res, 'Некорректное имя категории')
            }
            const categoryExist = await checkCategoryExist(categoryName, id);
            if (categoryExist) {
                return ErrorTemp.badRequest(res, 'Категория с таким именем уже существует');
            }
            if (id) {
                await models.Categories.update(
                    {
                        name: categoryName,
                    },
                    {
                        where: {
                            id: id,
                        },
                    }
                );
            }
            else {
                await models.Categories.create(
                    {name: categoryName},
                    {fields: ['name']});
            }
            res.json(categoryName);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async delete(req, res){
        try {
            const {id} = req.query;
            await models.Categories.destroy({
                where: {
                    id,
                },
            });
            res.json('deleted');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getAll(req, res) {
        try {
            const categories = await models.Categories.findAll({
                attributes: ['id', 'name'],
                order: [
                    ['id', 'ASC'],
                ],
            });
            for (const category of categories) {
                const itemForPreview = await models.Item.findOne({
                    attributes: ['images'],
                    where: {
                        categoryId: category.dataValues.id,
                        images: {[Op.not]: null},
                    },
                });
                category.dataValues.image = null
                itemForPreview && (category.dataValues.image = JSON.parse(itemForPreview.dataValues.images)[0]);
            }
            res.json(categories);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new CategoriesController();