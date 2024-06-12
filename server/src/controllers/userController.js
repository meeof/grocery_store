import * as models from '../models.js'
import ErrorTemp from '../errors/errorsTemplate.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt";
import {deleteSpace, getUserInfo, saveImages} from "../usefulFunctions.js";
import {Op} from "sequelize";
import {sequelize} from "../db.js";
const generateToken = (data) => {
    return jwt.sign(
        {'id': data.id, 'email': data.email, 'phone': data.phone, 'role': data.role},
        process.env.JWT_PRIVATE_KEY,
        {algorithm: 'HS256', expiresIn: '12h'});
}
const findEmailPassword = async (phoneEmail) => {
    return await models.User.findOne({
        attributes: ['id', 'email', 'phone', 'password', 'role'],
        where: {
            [Op.or]: [{ email: phoneEmail }, { phone: phoneEmail }],
        }
    });
}
class UserController {
    async registration(req, res) {
        try {
            const {email, password, role} = req.body;
            const {name, surname, language, phone} = req.body;
            const findEmail = await findEmailPassword(email);
            const findPhone = await findEmailPassword(phone);
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
                const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(7));
                const user = await sequelize.transaction(async () => {
                    const newUser = await models.User.create(
                        {email, phone, "password" : hashPassword, role},
                        {fields: ['id', 'email', 'phone', 'password', 'role']});
                    await models.UserInfo.create(
                        {name, surname, language, 'userId': newUser.dataValues.id},
                        {fields: ['name', 'surname', 'language', 'userId']});
                    return newUser;
                })
                const token = generateToken(user.dataValues);
                res.json(token);
            }
        } catch (error) {
            ErrorTemp.badRequest(res);
        }
    }
    async login(req, res) {
        try {
            const {enterLogin, enterPassword} = req.body;
            const user = await findEmailPassword(enterLogin);
            if (user) {
                const token = generateToken(user.dataValues);
                bcrypt.compareSync(enterPassword, user.dataValues.password) ?
                    res.json(token) : ErrorTemp.forbidden(res, 'неверный пароль');
            }
            else {
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
            const {id} = req.user;
            const info = await getUserInfo(id);
            res.json(info.dataValues)
        } catch (error) {
            ErrorTemp.err();
        }
    }
    async updateInfo(req, res) {
        try {
            const {userId, name, surname, status, about} = req.body;
            const {id} = req.user;
            let itemFields = {};
            const info = await getUserInfo(id);
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
                itemFields.img = await saveImages(req.files);
            }
            if (Object.keys(itemFields).length !== 0) {
                await models.UserInfo.update(
                    itemFields,
                    {
                        where: {
                            userId: id,
                        },
                    }
                );
                res.json('success');
            }
            else {
                res.json('success');
            }
        } catch (error) {
            ErrorTemp.badRequest(res)
        }
    }
    async deleteUser(req, res){
        try {
            const {id} = req.user
            await sequelize.transaction(async () => {
                await models.UserInfo.destroy({
                    where: {
                        userId: id,
                    },
                });
                await models.User.destroy({
                    where: {
                        id,
                    },
                });
            })
            res.json('delete success');
        } catch (error) {
            ErrorTemp.err();
        }
    }
}
export default new UserController();