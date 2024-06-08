import {makeAutoObservable} from "mobx";

class RerenderStore {
    constructor() {
        this._rerender = false;
        makeAutoObservable(this)
    }
    get rerender () {
        return this._rerender;
    }
    forceUpdate () {
        this._rerender = (!this._rerender)
    }
}
export default RerenderStore