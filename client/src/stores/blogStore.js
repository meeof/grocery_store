import {makeAutoObservable} from "mobx";
import {API} from "../api";

class BlogStore {
    constructor() {
        this._blog = null;
        this._count = 0;
        this._limit = 3;
        makeAutoObservable(this)
    }
    setBlog(value) {
        this._blog = value;
    }
    get blog() {
        return this._blog;
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
    fetch(finallyFun, one) {

        const query = {limit: this._limit}
        one && (query.one = true);
        API('get','/api/blog', query).then(data => {
            this._blog = data.rows;
            this._count = data.count;
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            finallyFun && finallyFun();
        })
    }
}
export default BlogStore