import {makeAutoObservable} from "mobx";

class UserStore {
    _isAuth = false;
    constructor() {
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