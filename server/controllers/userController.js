import * as models from '../models.js'
import ErrorTemp from '../errors/errorsTemplate.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from "bcrypt";
const generateToken = (data) => {
    return jwt.sign(
        {'id': data.id, 'email': data.email, 'role': data.role},
        process.env.JWT_PRIVATE_KEY,
        { algorithm: 'HS256', expiresIn: '12h'});
}
class UserController {
    async registration(req, res) {
        try {
            const {email, password, role} = req.body;
            const {name, surname, language, phone} = req.body;
            const salt = bcrypt.genSaltSync(7);
            const hashPassword = bcrypt.hashSync(password, salt);
            const newUser = await models.User.create(
                {email, "password" : hashPassword, salt, role},
                {fields: ['id', 'email', 'password', 'salt', 'role']});
            const newUserInfo = await models.UserInfo.create(
                {name, surname, language, phone, 'userId': newUser.dataValues.id},
                {fields: ['name', 'surname', 'language', 'phone', 'userId']});
            const token = generateToken(newUser.dataValues);
            res.json(token);
        } catch (error) {
            ErrorTemp.badRequest(res);
        }
    }
    async login(req, res) {
        try {
            const {phoneEmail, password} = req.body;
            const findEmail = await models.User.findOne({
                attributes: ['id', 'email', 'password', 'role'],
                where: {
                    email: phoneEmail
                }
            });
            const findPhone = await models.UserInfo.findOne({
                attributes: ['phone'],
                include: [{
                    model: models.User,
                    attributes: ['id', 'email', 'password', 'role'],
                }],
                where: {
                    phone: phoneEmail
                },
            });
            if (findEmail) {
                const token = generateToken(findEmail.dataValues);
                bcrypt.compareSync(password, findEmail.dataValues.password) ?
                    res.json(token) : ErrorTemp.forbidden(res, 'неверный пароль');
            }
            if (findPhone) {
                const token = generateToken(findPhone.user.dataValues);
                 bcrypt.compareSync(password, findPhone.user.dataValues.password) ?
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
}
export default new UserController();