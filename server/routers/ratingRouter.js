import express from "express";
import httpMiddleware from "../middlewares/httpMiddleware.js";
import ratingController from "../controllers/ratingController.js";
const ratingRouter = new express.Router();