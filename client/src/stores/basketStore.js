import {makeAutoObservable} from "mobx";

class BasketStore {
    constructor() {
        this._basket = [];
        this._orders = [];
        makeAutoObservable(this)
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