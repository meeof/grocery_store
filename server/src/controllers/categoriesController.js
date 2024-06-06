import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import {Op} from 'sequelize';
import {deleteSpace} from "../usefulFunctions.js";

class CategoriesController {
    async create(req, res) {
        try {
            let {categoryName} = req.body;
            categoryName = deleteSpace(categoryName)
            if (categoryName === '') {
                res.json('Некорректное имя категории');
            }
            else {
                const categoryExist = await models.Categories.findOne({
                    where: {
                        name: categoryName
                    },
                });
                if (categoryExist) {
                    res.json('Категория с таким именем уже существует');
                }
                else {
                    const newCategory = await models.Categories.create(
                        {name: categoryName},
                        {fields: ['name']});
                    res.json(newCategory.dataValues.name);
                }
            }
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
            res.json('delete success');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async update(req, res){
        try {
            let {id, categoryName} = req.body;
            categoryName = deleteSpace(categoryName)
            if (categoryName === '') {
                res.json('Некорректное имя категории');
            }
            else {
                const categoryExist = await models.Categories.findOne({
                    where: {
                        id: {[Op.not]: id},
                        name: categoryName
                    },
                });
                if (categoryExist) {
                    res.json('Категория с таким именем уже существует');
                }
                else {
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
                    res.json(categoryName);
                }
            }
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