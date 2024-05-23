import express from "express";
import httpMiddleware from "../middlewares/httpMiddleware.js";
import ratingController from "../controllers/ratingController.js";
const ratingRouter = new express.Router();
ratingRouter.get('/', ratingController.getRating);
ratingRouter.get('/:userId', ratingController.getRatingForUser);
ratingRouter.post('/', httpMiddleware.isAdmin, ratingController.setRatings);

export default ratingRouter;