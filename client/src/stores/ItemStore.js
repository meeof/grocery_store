import {makeAutoObservable} from "mobx";

class ItemStore {
    constructor() {
        this._items = null;
        this._showItem = {};
        this._count = 0;
        this._limit = 4;
        this._itemInfo = [];
        this._find = '';
        makeAutoObservable(this)
    }
    setFind(data) {
        this._find = data
    }
    get find() {
        return this._find
    }
    setItems(data) {
        this._items = data;
    }
    setOneItem(data) {
        this._showItem = data
    }
    setLimit(value) {
        this._limit = value;
    }
    setCount(value) {
        this._count = value;
    }
    get limit() {
        return this._limit;
    }
    get count() {
        return this._count;
    }
    get items() {
        return this._items;
    }
    get oneItem() {
        return this._showItem;
    }
}
export default ItemStore;


