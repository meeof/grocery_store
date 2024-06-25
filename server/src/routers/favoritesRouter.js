import express from "express";
import favoritesController from "../controllers/favoritesController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const favoritesRouter = new express.Router();

favoritesRouter.get('/', httpMiddleware.isAuth, favoritesController.get);
favoritesRouter.get('/check', httpMiddleware.isAuth, favoritesController.check);
favoritesRouter.post('/', httpMiddleware.isAuth, favoritesController.add);
favoritesRouter.delete('/', httpMiddleware.isAuth, favoritesController.delete);
export default favoritesRouter;