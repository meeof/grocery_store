import * as models from '../models.js';
import ErrorTemp from '../errors/errorsTemplate.js';
import * as path from 'path';
import __dirname from "../__dirname.js";
import { v4 as uuidv4 } from 'uuid';
class ItemController {
    async create(req, res) {
        let {name, price, discount, categoryId, info} = req.body;
        let imgNames = null;
        if (req?.files) {
            try {
                for (let key in req.files) {
                    if (!imgNames) {
                        imgNames = [];
                    }
                    const imgName = uuidv4() + '.jpg';
                    imgNames.push(imgName);
                    await req.files[key].mv(`${path.resolve(__dirname, 'static', imgName)}`)
                }
            } catch (error) {}
        }
        try {
            const newItem = await models.Item.create(
                {name, price: Number(price), discount: Number(discount),
                    images: imgNames !== null ? JSON.stringify(imgNames) : null, categoryId},
                {fields: ['name', 'price', 'discount', 'images', 'categoryId']});
            for (let obj of JSON.parse(info)) {
                const newItemInfo = await models.ItemInfo.create(
                    {title: obj.title, description: obj.description, itemId: newItem.dataValues.id},
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
                attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId'],
                where, limit, offset
            })
            allItems.rows.map(item => {
                if (item.dataValues.images === null) {
                    item.dataValues.images = [];
                }
                else {
                    item.dataValues.images = JSON.parse(item.dataValues.images);
                }
            })
            res.json(allItems);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async getOne(req, res) {
        try {
            const oneItem = await models.Item.findOne({
                attributes: ['id', 'name', 'price', 'discount', 'images', 'categoryId'],
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
                ...oneItem.dataValues,
                images: oneItem.images? JSON.parse(oneItem.images) : [],
                info: itemInfos.map(itemInfo => itemInfo.dataValues)
            };
            res.json(frontResponse);
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
}
export default new ItemController();