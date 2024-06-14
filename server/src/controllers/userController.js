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
const findEmailPhone = async (phoneEmail) => {
    return await models.User.findOne({
        attributes: ['id', 'email', 'phone', 'password', 'role'],
        where: {
            [Op.or]: [{ email: phoneEmail }, { phone: phoneEmail }],
        }
    });
};
const checkStatementStatus = async (userId) => {
    const statement = await models.Statements.findOne({
        attributes: ['status'],
        where: {
            userId,
        }
    });
    return statement ? statement.dataValues.status : null;
}
class UserController {
    async registration(req, res) {
        try {
            const {email, password, role} = req.body;
            const {name, surname, language, phone} = req.body;
            const findEmail = await findEmailPhone(email);
            const findPhone = await findEmailPhone(phone);
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
            const user = await findEmailPhone(enterLogin);
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
            let id = null;
            if (req.user.role === 'ADMIN' && req.query.id) {
                id = req.query.id;
            }
            const info = await getUserInfo(id ? id : req.user.id);
            res.json(info.dataValues)
        } catch (error) {
            ErrorTemp.err();
        }
    }
    async updateInfo(req, res) {
        try {
            const {name, surname, status, about} = req.body;
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
    async statement(req, res) {
        try {
           const statement = await checkStatementStatus(req.user.id);
           res.json(statement);
        } catch (error) {
            ErrorTemp.err();
        }
    }
    async allStatements(req, res){
        try {
            const {limit} = req.query;
            const statements = await models.Statements.findAndCountAll({
                attributes: ['id', 'status', "userId", "updatedAt"],
                where: {
                    status: 'pending',
                },
                limit: limit ? limit : 3,
                order: [
                    ['updatedAt', 'DESC'],
                ],
            })
            res.json(statements);
        } catch (error) {
            ErrorTemp.err();
        }
    }
    async addStatement(req, res) {
        const t = await sequelize.transaction();
        try {
            const {status, userId} = req.body;
            if (req.user.role === 'ADMIN') {
               await models.Statements.update(
                    {status},
                    {
                        where: {
                            userId
                        },
                        transaction: t
                    }
                )
               if (status === 'resolve') {
                   await models.User.update (
                       {role: 'SELLER'},
                       {
                           where: {
                               id: userId,
                           },
                           transaction: t
                       }
                   )
                   await t.commit();
               }
               else {
                   await t.commit()
               }
                return res.json(status);
            }
            const statement = await checkStatementStatus(req.user.id);
            if (statement === 'reject') {
                await models.Statements.update(
                    {status: 'pending'},
                    {
                        where: {
                            userId: req.user.id,
                        }
                    }
                )
                return res.json('pending');
            }
            else if (!statement) {
                await models.Statements.create(
                    {status: 'pending', userId: req.user.id},
                    {fields: ['status', 'userId']});
                return res.json('pending');
            }
            else {
                return res.json('banned');
            }
        } catch (error) {
            await t.rollback();
            ErrorTemp.err();
        }
    }
}
export default new UserController();