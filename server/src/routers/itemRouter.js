import express from "express";
import itemController from "../controllers/itemController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const itemRouter = new express.Router();
itemRouter.get('/', itemController.getAll);
itemRouter.get('/one', itemController.getOne);
itemRouter.post('/', httpMiddleware.isSeller, itemController.createUpdate);
itemRouter.delete('/',httpMiddleware.isSeller, itemController.delete);
export default itemRouter;