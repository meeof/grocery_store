import React from 'react';
import {Route, Routes} from "react-router-dom";
import Main from "./pages/Main";
import Catalog from "./pages/Catalog";
import Item from "./pages/Item";
import Profile from "./pages/Profile";
import Category from "./pages/Category";
import Basket from "./pages/Basket";
import Order from "./pages/Order";
import Orders from "./pages/Orders";
import LoginRegistrationRestore from "./pages/LoginRegistrationRestore";
import Statements from "./pages/Statements";
import Favorites from "./pages/Favorites";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/catalog/:categoryId/:productId" element={<Item/>} />
            <Route path="/catalog/:categoryId" element={<Category/>} />
            <Route path="/catalog" element={<Catalog/>} />
            <Route path="/profile/login" element={<LoginRegistrationRestore/>} />
            <Route path="/profile/restore" element={<LoginRegistrationRestore/>} />
            <Route path="/profile/registration" element={<LoginRegistrationRestore/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile/orders" element={<Orders/>} />
            <Route path="/basket" element={<Basket/>} />
            <Route path="/basket/order" element={<Order/>} />
            <Route path="/statements" element={<Statements/>} />
            <Route path="/favorites" element={<Favorites/>} />
            <Route path="*" element={<Main/>} />
        </Routes>
    );
};

export default AppRouter;