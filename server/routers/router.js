import express from "express";
import userRouter from "./userRouter.js";
import categoriesRouter from "./categoriesRouter.js";
import itemRouter from "./itemRouter.js";
const router = new express.Router();

router.use('/user', userRouter);
router.use('/categories', categoriesRouter);
router.use('/item', itemRouter)
export default router;