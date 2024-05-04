import {makeAutoObservable} from "mobx";

class BasketStore {
    constructor() {
        this._basket = [];
        makeAutoObservable(this)
    }
    setBasket(data) {
        this._basket = data;
    }
    get basket() {
        return this._basket;
    }
}
export default BasketStore;