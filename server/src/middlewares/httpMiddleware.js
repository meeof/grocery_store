import jwt from 'jsonwebtoken';
import ErrorTemp from '../errors/errorsTemplate.js';
const decodeToken = (req) => {
    const token = req.headers.authorization.split(' ')[1];
    return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
}
class HttpMiddleware {
    isAuth(req, res, next) {
        try {
            const decoded = decodeToken(req);
            !decoded && ErrorTemp.forbidden(res);
            req.user = decoded;
            next();
        } catch (error) {
            ErrorTemp.err(res, 401, 'Unauthorized');
        }
    }
    isSeller(req, res, next) {
        try {
            (req.user.role !== 'ADMIN' && req.user.role !== 'SELLER') ? ErrorTemp.forbidden(res) : next();
        } catch (error) {
            ErrorTemp.forbidden(res);
        }
    }
    isAdmin(req, res, next) {
        try {
            req.user.role !== 'ADMIN' ? ErrorTemp.forbidden(res) : next();
        } catch (error) {
            ErrorTemp.forbidden(res);
        }
    }
}
export default new HttpMiddleware();

