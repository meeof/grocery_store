import express from "express";
import itemController from "../controllers/itemController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const itemRouter = new express.Router();
itemRouter.get('/', itemController.getAll);
itemRouter.get('/one', itemController.getOne);
itemRouter.post('/', httpMiddleware.isAdmin, itemController.createUpdate);
itemRouter.delete('/', itemController.delete);
export default itemRouter;