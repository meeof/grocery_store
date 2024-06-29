import {makeAutoObservable} from "mobx";

class FavoritesStore {
    constructor() {
        this._favorites = null;
        this._count = 0;
        this._limit = 6;
        makeAutoObservable(this)
    }
    setFavorites(value) {
        this._favorites = value;
    }
    get favorites() {
        return this._favorites;
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
}
export default FavoritesStore