import express from "express";
import categoriesController from "../controllers/categoriesController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const categoriesRouter = new express.Router();
categoriesRouter.get('/', categoriesController.getAll);
categoriesRouter.post('/', httpMiddleware.isAdmin, categoriesController.create);
export default categoriesRouter;