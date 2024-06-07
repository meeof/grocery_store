import {makeAutoObservable} from "mobx";
import * as uf from "../usefulFunctions";
import {API} from "../api";

class ItemStore {
    constructor() {
        this._items = null;
        this._showItem = null;
        this._count = 0;
        this._limit = 6;
        this._itemInfo = [];
        this._find = '';
        this._categoryId = 'all';
        this._page = 1;
        makeAutoObservable(this)
    }
    setPage(val) {
        this._page = val;
    }
    get page () {
        return this._page;
    }
    setCategoryId (val) {
        this._categoryId = val;
    }
    get categoryId () {
        return this._categoryId;
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
    fetchItems (page) {
        const params = {limit: this.limit, page: page || 1, find: this.find};
        if (this._categoryId !== 'all') {
            params.categoryId = uf.routeUnPrefix(this._categoryId);
        }
        API('get', '/api/item', params).then(data => {
            if (this._items !== data.rows) {
                this.setItems(data.rows);
                this.setCount(data.count);
            }
        });
    }
}
export default ItemStore;


