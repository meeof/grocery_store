import express from "express";
import itemController from "../controllers/itemController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const itemRouter = new express.Router();
itemRouter.get('/', itemController.getAll);
itemRouter.get('/one', itemController.getOne);
itemRouter.post('/', httpMiddleware.isAdmin, itemController.create);
itemRouter.delete('/', itemController.delete);
itemRouter.patch('/', itemController.update);
export default itemRouter;