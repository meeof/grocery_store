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
    get items() {
        return this._items;
    }
    setOneItem(data) {
        this._showItem = data
    }
    get oneItem() {
        return this._showItem;
    }
    setLimit(value) {
        this._limit = value;
    }
    get limit() {
        return this._limit;
    }
    setCount(value) {
        this._count = value;
    }
    get count() {
        return this._count;
    }
    fetchItems (page) {
        const params = {limit: this._limit, page: page || 1, find: this._find};
        if (this._categoryId !== 'all') {
            params.categoryId = uf.routeUnPrefix(this._categoryId);
        }
        API('get', '/api/item', params).then(data => {
            this._items = data.rows;
            this._count = data.count;
        });
    }
}
export default ItemStore;


