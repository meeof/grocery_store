import {makeAutoObservable} from "mobx";

class CategoryStore {
    constructor() {
        this._categories = null;
        makeAutoObservable(this)
    }
    setCategories(data) {
        this._categories = data
    }
    get categories() {
        return this._categories;
    }
}
export default CategoryStore;