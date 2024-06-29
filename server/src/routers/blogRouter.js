import express from "express";
import httpMiddleware from "../middlewares/httpMiddleware.js";
import blogController from "../controllers/blogController.js";

const blogRouter = new express.Router();

blogRouter.get('/', blogController.getAll)
blogRouter.post('/', httpMiddleware.isAuth, httpMiddleware.isAdmin, blogController.createUpdate);
blogRouter.delete('/', httpMiddleware.isAuth, httpMiddleware.isAdmin, blogController.delete);

export default blogRouter