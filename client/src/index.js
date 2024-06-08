import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import UserStore from "./stores/userStore";
import ItemStore from "./stores/ItemStore";
import BasketStore from "./stores/basketStore";
import OverlayStore from "./stores/overlayStore";
import CategoryStore from "./stores/categoryStore";
import ReviewStore from "./stores/reviewStore";
import RerenderStore from "./stores/rerenderStore";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        item: new ItemStore(),
        basket: new BasketStore(),
        overlay: new OverlayStore(),
        category: new CategoryStore(),
        review: new ReviewStore(),
        render: new RerenderStore(),
    }}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
        {/*<React.StrictMode>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </React.StrictMode>*/}
    </Context.Provider>
);
