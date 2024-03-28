import express from "express";
import userController from "../controllers/userController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const userRouter = new express.Router();
userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.get('/auth', httpMiddleware.isAuth, userController.check)
export default userRouter;
