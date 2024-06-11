import {makeAutoObservable} from "mobx";
import {authAPI} from "../api";

class ReviewStore {
    constructor() {
        this._bought = null;
        this._reviewed = null;
        this._reviews = null;
        makeAutoObservable(this)
    }
    get reviews() {
        return this._reviews;
    }
    setReviews (value) {
        this._reviews = value;
    }
    get bought() {
        return this._bought;
    }
    setBought (value) {
        this._bought = value;
    }
    get reviewed() {
        return this._reviewed;
    }
    setReviewed (value) {
        this._reviewed = value;
    }
    check (userId, itemId, field, thenCallback, finallyCallback) {
        authAPI('get', '/api/reviews/check', {userId, itemId, field}).then(data => {
            thenCallback && thenCallback(data);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            finallyCallback && finallyCallback();
        })
    }
}
export default ReviewStore;