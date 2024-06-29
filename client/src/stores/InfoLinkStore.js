import {makeAutoObservable} from "mobx";

class InfoLinkStore {
    constructor() {
        this._links = [];
        this._infos = [];
        makeAutoObservable(this)
    }
    setInfos(data) {
        this._infos = data;
    }
    get infos() {
        return this._infos;
    }
    setLinks(data) {
        this._links = data;
    }
    get links() {
        return this._links;
    }
    handler = (method, type, index, text, isTitle) => {
        let newObj = Object.assign([], type === 'link' ? this._links : this._infos);
        switch (method) {
            case 'delete' : newObj = newObj.filter((element, idx) => idx !== index)
            break
            case 'change' :  isTitle ? newObj[index].title = text : newObj[index].content = text;
            break
            default : newObj.push({title: '', content: ''});
            break
        }
        type === 'link' ? this.setLinks(newObj) : this.setInfos(newObj);
    }
}
export default InfoLinkStore