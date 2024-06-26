import express from "express";
import httpMiddleware from "../middlewares/httpMiddleware.js";
import ratingController from "../controllers/ratingController.js";
const ratingRouter = new express.Router();
ratingRouter.get('/', ratingController.getRating);
ratingRouter.get('/user', httpMiddleware.isAuth, ratingController.getRatingOneUser);
ratingRouter.post('/', httpMiddleware.isAuth, ratingController.setRatings);

export default ratingRouter;