import {makeAutoObservable} from "mobx";
import {authAPI, authorization} from "../api";

class UserStore {
    constructor() {
        this._isAuth = null;
        this._userInfo = null;
        this._statement = null;
        this._statements = null;
        this._statementsCount = 0;
        this._statementsLimit = 6;
        makeAutoObservable(this)
    }
    setAllStatementsLimit(data) {
        this._statementsLimit = data;
    }
    get allStatementsLimit() {
        return this._statementsLimit;
    }
    setAllStatementsCount(data) {
        this._statementsCount = data;
    }
    get allStatementsCount() {
        return this._statementsCount;
    }
    setAllStatements(data) {
        this._statements = data;
    }
    get allStatements() {
        return this._statements;
    }
    setStatement(data) {
        this._statement = data;
    }
    get statement() {
        return this._statement;
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
            if (data === 'Unauthorized') {
                navigate && navigate('/profile/login');
                return
            }
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