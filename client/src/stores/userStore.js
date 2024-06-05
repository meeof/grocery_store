import {makeAutoObservable} from "mobx";
import {authAPI, authorization} from "../api";

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
    fetchUserInfo() {
        authAPI('get', '/api/user/info', {userId : this.isAuth.id}).then(data => {
            this.setUserInfo(data);
        }).catch((err) => {
            console.log(err)
        })
    }
    userExit(navigate) {
        localStorage.setItem('token', '');
        this.setAuth(false);
        navigate('/');
    }
    checkAuthUser(callback, navigate) {
        if (!this.isAuth) {
            authorization().then(data => {
                this.setAuth(data);
                callback && callback();
            }).catch(() => {
                this.setAuth(false);
                navigate && navigate('/profile/login');
            })
        }
        else {
            callback && callback();
        }
    }
}
export default UserStore;