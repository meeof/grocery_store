import reviewController from "../controllers/reviewController.js";
import express from "express";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const reviewRouter = new express.Router();
reviewRouter.get('/', reviewController.getReviews);
reviewRouter.get('/check', httpMiddleware.isAuth, reviewController.check);
reviewRouter.post('/', httpMiddleware.isAuth, reviewController.addUpdateReview);
reviewRouter.delete('/', httpMiddleware.isAuth, reviewController.deleteReview);

export default reviewRouter