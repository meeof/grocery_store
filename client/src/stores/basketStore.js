import {makeAutoObservable} from "mobx";
import {authAPI} from "../api";

class BasketStore {
    constructor() {
        this._basket = null;
        this._orders = null;
        this._allCost = 0;
        this._limit = 4;
        this._count = 0;
        makeAutoObservable(this)
    }
    setAllCost (value) {
        this._allCost = value;
    }
    get allCost () {
        return this._allCost;
    }
    setBasket(data) {
        this._basket = data;
    }
    get getBasket() {
        return this._basket;
    }
    setOrders(data) {
        this._orders = data;
    }
    get getOrders () {
        return this._orders;
    }
    setOrdersLimit(value) {
        this._limit = value;
    }
    get ordersLimit() {
        return this._limit;
    }
    setOrdersCount(value) {
        this._count = value;
    }
    get ordersCount() {
        return this._count;
    }
    countSumCost() {
        if (this._basket) {
            this._allCost = (this._basket.reduce(
                (accumulator, product) => accumulator + product.cost * product.amount,
                0,
            ))
        }
        else this._allCost = 0;
    }
    fetchBasket(userId) {
        authAPI('get', '/api/basket', {userId}).then(data => {
            this._basket = data;
            this.countSumCost();
        }).catch(err => {
            console.log(err);
        });
    }
}
export default BasketStore;