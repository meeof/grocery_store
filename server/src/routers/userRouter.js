import express from "express";
import userController from "../controllers/userController.js";
import httpMiddleware from "../middlewares/httpMiddleware.js";
const userRouter = new express.Router();
userRouter.post('/registration', userController.registration);
userRouter.post('/login', userController.login);
userRouter.get('/auth', httpMiddleware.isAuth, userController.check);
userRouter.get('/info', httpMiddleware.isAuth, userController.getInfo);
userRouter.get('/statement', httpMiddleware.isAuth, userController.statement);
userRouter.get('/allStatements', httpMiddleware.isAuth, httpMiddleware.isAdmin, userController.allStatements);
userRouter.post('/statement', httpMiddleware.isAuth, userController.addStatement);
userRouter.patch('/info', httpMiddleware.isAuth, userController.updateInfo)
userRouter.delete('/',  httpMiddleware.isAuth, userController.deleteUser)
export default userRouter;
