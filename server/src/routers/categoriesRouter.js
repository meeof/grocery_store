import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const categoriesRouter = new express.Router();
categoriesRouter.get('/', categoriesController.getAll);
categoriesRouter.post('/', httpMiddleware.isSeller, categoriesController.createUpdate);
categoriesRouter.delete('/', httpMiddleware.isAdmin, categoriesController.delete);
export default categoriesRouter;