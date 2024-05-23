import {makeAutoObservable} from "mobx";

class ItemStore {
    constructor() {
        this._categories = [];
        this._items = [];
        this._showItem = {};
        this._count = 0;
        this._limit = 4;
        this._itemInfo = [
            {id: 1, itemId: 1, title: 'Страна', description: 'Уругвай'},
            {id: 2, itemId: 1, title: 'Цвет', description: 'Зеленый'},
            {id: 3, itemId: 2, title: 'Страна', description: 'Эквадор'},
            {id: 4, itemId: 2, title: 'Масса', description: '1кг.'},
        ];
        makeAutoObservable(this)
    }
    setCategories(data) {
        this._categories = data
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
    get categories() {
        return this._categories;
    }
    get items() {
        return this._items;
    }
    get oneItem() {
        return this._showItem;
    }
}
export default ItemStore;


