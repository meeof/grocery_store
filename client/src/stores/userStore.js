import {makeAutoObservable} from "mobx";

class UserStore {
    constructor() {
        this._isAuth = false;
        makeAutoObservable(this)
    }
    setAuth(data) {
        this._isAuth = data;
    }
    get isAuth() {
        return this._isAuth;
    }
}
export default UserStore;