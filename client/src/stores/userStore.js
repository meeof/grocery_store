import {makeAutoObservable} from "mobx";

class UserStore {
    constructor() {
        this._isAuth = false;
        this._userInfo = false;
        this._rerender = false;
        makeAutoObservable(this)
    }
    get rerender () {
        return this._rerender;
    }
    forceUpdate () {
        this._rerender = (!this._rerender)
    }
    setAuth(data) {
        this._isAuth = data;
    }
    get isAuth() {
        return this._isAuth;
    }
    setUserInfo(data) {
        this._userInfo = data;
    }
    get userInfo() {
        return this._userInfo;
    }
}
export default UserStore;