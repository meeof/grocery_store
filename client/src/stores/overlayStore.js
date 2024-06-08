import {makeAutoObservable, configure} from "mobx";
import {colors} from "../StyledGlobal";
configure({
    enforceActions: "never",
})

class OverlayStore {
    constructor() {
        this._color = colors.opacityRed;
        this._show = false;
        this._target = null;
        this._message = '-';
        makeAutoObservable(this)
    }
    get color() {
        return this._color;
    }
    setColor(val) {
        this._color = val;
    }
    get show() {
        return this._show;
    }
    setShow(val) {
        this._show = val;
    }
    get target() {
        return this._target;
    }
    setTarget(target) {
        this._target = target
    }
    get message() {
        return this._message;
    }
    setMessage(message) {
        this._message = message;
    }
    handlerOverlay () {
        this._show = true
        setTimeout(() => {
            this._show = false
        }, 2000);
    }
}
export default OverlayStore;