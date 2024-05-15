import express from "express";
import basketController from "../controllers/BasketController.js";
const basketRouter = new express.Router();
basketRouter.get('/', basketController.getOneAmount);
basketRouter.get('/orders', basketController.getOrders);
basketRouter.get('/orderContacts', basketController.getContacts);
basketRouter.post('/formOrder', basketController.formOrder)
basketRouter.get('/:userId', basketController.getAll);
basketRouter.post('/', basketController.addItem);
basketRouter.delete('/', basketController.deleteItem);
export default basketRouter;