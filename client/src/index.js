import React, {createContext} from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css';
import UserStore from "./stores/userStore";
import ItemStore from "./stores/ItemStore";
import BasketStore from "./stores/basketStore";

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider value={{
        user: new UserStore(),
        item: new ItemStore(),
        basket: new BasketStore(),
    }}>
        <React.StrictMode>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </React.StrictMode>
    </Context.Provider>
);
