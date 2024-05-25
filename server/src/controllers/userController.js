import * as models from '../models.js'
import ErrorTemp from '../errors/errorsTemplate.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt";
import {deleteSpace} from "../usefulFunctions.js";
import {v4 as uuidv4} from "uuid";
import path from "path";
import __dirname from "../__dirname.js";
const generateToken = (data) => {
    return jwt.sign(
        {'id': data.id, 'email': data.email, 'role': data.role},
        process.env.JWT_PRIVATE_KEY,
        { algorithm: 'HS256', expiresIn: '12h'});
}
export const getUserInfo = async (userId) => {
    return  await models.UserInfo.findOne({
        where: {
            userId,
        },
    });
}
const findEmailPassword = async (arr) => {
    let findEmail = null;
    let findPhone = null;
    for (let str of arr) {
        findEmail = await models.User.findOne({
            attributes: ['id', 'email', 'password', 'role'],
            where: {
                email: str
            }
        });
        findPhone = await models.UserInfo.findOne({
            attributes: ['phone'],
            include: [{
                model: models.User,
                attributes: ['id', 'email', 'password', 'role'],
            }],
            where: {
                phone: str
            },
        });
        if (findEmail || findPhone) break;
    }
    return {
        findEmail,
        findPhone
    }
}
class UserController {
    async registration(req, res) {
        try {
            const {email, password, role} = req.body;
            const {name, surname, language, phone} = req.body;
            const {findEmail, findPhone} = await findEmailPassword([email, phone]);
            if (deleteSpace(name) === '') {
                ErrorTemp.badRequest(res, 'Имя некорректно');
            }
            else if (deleteSpace(surname) === '') {
                ErrorTemp.badRequest(res, 'Фамилия некорректна');
            }
            else if (deleteSpace(email) === '' || !email.includes('@')) {
                ErrorTemp.badRequest(res, 'Email некорректен');
            }
            else if (isNaN(Number(phone)) || Number(phone) === 0) {
                ErrorTemp.badRequest(res, 'Номер телефона некорректен');
            }
            else if (findEmail) {
                ErrorTemp.badRequest(res, 'Пользователь с данным email уже зарегистрирован');
            }
            else if (findPhone) {
                ErrorTemp.badRequest(res, 'Пользователь с данным номером телефона уже зарегистрирован');
            }
            else if (deleteSpace(password) === '' || password.length < 4) {
                ErrorTemp.badRequest(res, 'Выбранный пароль слишком простой');
            }
            else {
                const salt = bcrypt.genSaltSync(7);
                const hashPassword = bcrypt.hashSync(password, salt);
                const newUser = await models.User.create(
                    {email, "password" : hashPassword, salt, role},
                    {fields: ['id', 'email', 'password', 'salt', 'role']});
                const newUserInfo = await models.UserInfo.create(
                    {name, surname, language, phone, 'userId': newUser.dataValues.id},
                    {fields: ['name', 'surname', 'language', 'phone', 'userId']});
                const newUserBasket = await models.Basket.create(
                    {"userId": newUser.dataValues.id}
                )
                const token = generateToken(newUser.dataValues);
                res.json(token);
            }
        } catch (error) {
            ErrorTemp.badRequest(res);
        }
    }
    async login(req, res) {
        try {
            const {phoneEmail, enterPassword} = req.body;
            const {findEmail, findPhone} = await findEmailPassword([phoneEmail]);
            if (findEmail) {
                const token = generateToken(findEmail.dataValues);
                bcrypt.compareSync(enterPassword, findEmail.dataValues.password) ?
                    res.json(token) : ErrorTemp.forbidden(res, 'неверный пароль');
            }
            if (findPhone) {
                const token = generateToken(findPhone.user.dataValues);
                 bcrypt.compareSync(enterPassword, findPhone.user.dataValues.password) ?
                     res.json(token) : ErrorTemp.forbidden(res, 'неверный пароль');
            }
            if (!findEmail && !findPhone) {
                ErrorTemp.err(res,401, 'Пользователь не зарегистрирован')
            }
        } catch (error) {
            ErrorTemp.err(res)
        }
    }
    async check(req, res) {
        try {
            const token = generateToken(req.user)
            res.json(token);
        } catch (error) {
            ErrorTemp.err();
        }

    }
    async getInfo(req, res) {
        try {
            const {userId} = req.query
            const info = await getUserInfo(userId);
            res.json(info.dataValues)
        } catch (error) {
            ErrorTemp.err();
        }
    }
    async updateInfo(req, res) {
        try {
            const {userId, name, surname, status, about} = req.body;
            let itemFields = {};
            const info = await getUserInfo(userId);
            if (name && name !== info.dataValues.name) {
                itemFields.name = name
            }
            if (surname && surname !== info.dataValues.surname) {
                itemFields.surname = surname
            }
            if (status && status !== info.dataValues.status) {
                itemFields.status = status
            }
            if (about && about !== info.dataValues.about) {
                itemFields.about = about
            }
            if (req?.files) {
                let imgName = ''
                for (let key in req.files) {
                    imgName = uuidv4() + '.jpg';
                    await req.files[key].mv(`${path.resolve(__dirname, 'static', imgName)}`)
                }
                itemFields.img = imgName;
            }
            if (Object.keys(itemFields).length === 0) {
                res.json('success');
            }
            else {
                await models.UserInfo.update(
                    itemFields,
                    {
                        where: {
                            userId,
                        },
                    }
                );
                res.json('success');
            }

        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async deleteUser(req, res){
        try {
            const {userId} = req.query
            await models.UserInfo.destroy({
                where: {
                    userId,
                },
            });
            await models.User.destroy({
                where: {
                    id: userId,
                },
            });
            res.json('delete success');

        } catch (error) {
            ErrorTemp.err();
        }
    }
}
export default new UserController();