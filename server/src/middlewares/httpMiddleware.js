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
            res.json('Unauthorized')
            /*ErrorTemp.forbidden(res);*/
        }
    }
    isAdmin(req, res, next) {
        try {
            const decoded = decodeToken(req);
            decoded.role !== 'ADMIN' ? ErrorTemp.forbidden(res) : next();
        } catch (error) {
            ErrorTemp.forbidden(res);
        }
    }
}
export default new HttpMiddleware();

