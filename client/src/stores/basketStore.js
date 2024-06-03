import {makeAutoObservable} from "mobx";

class BasketStore {
    constructor() {
        this._basket = null;
        this._orders = [];
        this._allCost = 0;
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
}
export default BasketStore;