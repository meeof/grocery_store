import {deleteSpace, saveImages} from "../usefulFunctions.js";
import {Op} from "sequelize";
import * as models from "../models.js";
import ErrorTemp from "../errors/errorsTemplate.js";

class BlogController {
    async createUpdate(req, res) {
        try {
            let {id, title, text, links, structure} = req.body;
            const publicationFields = {};
            if (typeof title === 'string') {
                title = deleteSpace(title);
                const where = {title};
                id && (where.id = {[Op.not]: id});
                const titleExist = await models.Blog.findOne({
                    where,
                });
                if (titleExist || title === '') {
                    return ErrorTemp.badRequest(res, 'Некорректный заголовок');
                }
                else {
                    publicationFields.title = title;
                }
            }
            if (typeof text === 'string') {
                text = deleteSpace(text);
                if (text === '') {
                    return ErrorTemp.badRequest(res, 'Некорректный текст');
                }
                else {
                    publicationFields.text = text;
                }
            }
            links && (publicationFields.links = links);
            structure && (publicationFields.structure = structure);
            if (req?.files) {
                publicationFields.image = await saveImages(req.files, false);
            }
            if (id) {
                await models.Blog.update(
                    publicationFields,
                    {
                        where: {
                            id: id,
                        },
                    }
                );
            }
            else {
                publicationFields.userId = req.user.id;
                await models.Blog.create(
                    publicationFields, {fields: ['title', 'text', 'links', 'structure', 'image', 'userId']},
                );
            }
            res.json('success');
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getAll(req, res) {
        try {
            let {one, limit} = req.query;
            limit = limit || 4;
            one && (limit = 1);
            const publications = await models.Blog.findAndCountAll({
                attributes: ['id', 'title', 'text', 'links', 'structure', 'image', 'userId', "createdAt"],
                limit,
                order: [
                    ["createdAt", 'DESC'],
                ]
            })
            res.json(publications);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async delete(req, res) {
        try {
            const {id} = req.query;
            await models.Blog.destroy({
                where: {
                    id,
                },
            });
            res.json('deleted');
        }  catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new BlogController();