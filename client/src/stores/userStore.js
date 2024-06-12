import {makeAutoObservable} from "mobx";
import {authAPI, authorization} from "../api";

class UserStore {
    constructor() {
        this._isAuth = null;
        this._userInfo = null;
        makeAutoObservable(this)
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
    fetchUserInfo(navigate) {
        authAPI('get', '/api/user/info').then(data => {
            this._userInfo = data;
        }).catch((err) => {
            console.log(err);
            navigate && navigate('/profile/login');
        })
    }
    userExit(navigate) {
        localStorage.setItem('token', '');
        this._userInfo = false;
        this._isAuth = false;
        navigate('/');
    }
    checkAuthUser(callback, navigate) {
        if (!this._isAuth) {
            authorization().then(data => {
                this._isAuth = data;
                callback && callback();
            }).catch(() => {
                this._isAuth = false;
                navigate && navigate('/profile/login');
            })
        }
        else {
            callback && callback();
        }
    }
}
export default UserStore;