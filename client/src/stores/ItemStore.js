import {makeAutoObservable} from "mobx";

class ItemStore {
    _categories = [];
    _items = [];
    _showItem = {};
    _count = 0;
    _limit = 3;
    _rating = [
        {id: 1, itemId: 1, userId: 1, rate: 4},
        {id: 2, itemId: 2, userId: 1, rate: 4},
        {id: 3, itemId: 3, userId: 1, rate: 4},
        {id: 4, itemId: 4, userId: 1, rate: 4},
        {id: 5, itemId: 5, userId: 1, rate: 4},
        {id: 6, itemId: 6, userId: 1, rate: 4},
    ];
    _itemInfo = [
        {id: 1, itemId: 1, title: 'Страна', description: 'Уругвай'},
        {id: 2, itemId: 1, title: 'Цвет', description: 'Зеленый'},
        {id: 3, itemId: 2, title: 'Страна', description: 'Эквадор'},
        {id: 4, itemId: 2, title: 'Масса', description: '1кг.'},
    ]
    constructor() {
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




    get rating() {
        return this._rating;
    }
}
export default ItemStore;


