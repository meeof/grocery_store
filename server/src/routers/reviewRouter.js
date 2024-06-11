import reviewController from "../controllers/reviewController.js";
import express from "express";
const reviewRouter = new express.Router();
reviewRouter.get('/', reviewController.getReviews);
reviewRouter.get('/check', reviewController.check);
reviewRouter.post('/', reviewController.addUpdateReview);
reviewRouter.delete('/', reviewController.deleteReview);

export default reviewRouter