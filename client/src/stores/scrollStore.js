import {makeAutoObservable} from "mobx";

class ScrollStore {
    constructor() {
        this._scroll = 0;
        makeAutoObservable(this)
    }
    scrollToPoint () {
        window.scrollTo({top: this._scroll - window.innerHeight, behavior: "instant"})
        window.scrollTo({top: this._scroll - window.innerHeight/2, behavior: "smooth"})
    }
    setScroll() {
        this._scroll = document.body.getBoundingClientRect().height;
    }
}
export default ScrollStore