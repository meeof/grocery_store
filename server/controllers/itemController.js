import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import * as path from 'path';
import __dirname from "../__dirname.js";
import { v4 as uuidv4 } from 'uuid';
class ItemController {
    async create(req, res) {
        let {name, price, discount, categoryId, info} = req.body;
        info ? info = JSON.parse(info) : {};
        const imgName = uuidv4() + '.jpg';
        await req.files.img.mv(`${path.resolve(__dirname, 'static', imgName)}`);
        try {
            const newItem = await models.Item.create(
                {name, price, discount, img: imgName, categoryId},
                {fields: ['name', 'price', 'discount', 'img', 'categoryId']});
            for (let key in info) {
                const newItemInfo = await models.ItemInfo.create(
                    {title: key, description: info[key], itemId: newItem.dataValues.id},
                    {fields: ['title', 'description', 'itemId']}
                )
            }
            res.json(newItem.dataValues);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getAll(req, res) {
        try {
            let {catId, limit, page} = req.query;
            page = page || 1;
            limit = limit || 3;
            let offset = limit * (page - 1);
            let where = {};
            catId ? where = {'categoryId': catId} : {};
            const allItems = await models.Item.findAndCountAll({
                attributes: ['id', 'name', 'price', 'discount', 'img', 'categoryId'],
                where, limit, offset
            });
            res.json(allItems);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getOne(req, res) {
        try {
            const oneItem = await models.Item.findOne({
                attributes: ['id', 'name', 'price', 'discount', 'img', 'categoryId'],
                where: {
                    id: req.params.id
                }
            });
            const itemInfos = await models.ItemInfo.findAll({
                attributes: ['id', 'title', 'description'],
                where: {
                    itemId: req.params.id
                }
            })
            const frontResponse = {
                ...oneItem.dataValues, info: itemInfos.map(itemInfo => itemInfo.dataValues)
            };
            res.json(frontResponse);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new ItemController();