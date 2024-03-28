export default class ErrorsTemplate extends Error{
    static err(res, status, message) {
        status ? res.statusCode = status : res.statusCode = 500;
        message ? res.json(message) : res.json('Internal Server Error');
    }
    static badRequest(res, message) {
        res.statusCode = 400;
        message ? res.json(message) : res.json('Bad Request');
    }
    static forbidden(res, message) {
        res.statusCode = 403;
        message ? res.json(message) : res.json('Forbidden');
    }
}