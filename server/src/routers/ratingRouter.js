import express from "express";
import httpMiddleware from "../middlewares/httpMiddleware.js";
import ratingController from "../controllers/ratingController.js";
const ratingRouter = new express.Router();
ratingRouter.get('/', ratingController.getRating);
ratingRouter.get('/user', ratingController.getRatingOneUser);
ratingRouter.post('/', httpMiddleware.isSeller, ratingController.setRatings);

export default ratingRouter;