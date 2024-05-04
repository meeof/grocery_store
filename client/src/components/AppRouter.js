import React from 'react';
import {Route, Routes} from "react-router-dom";
import Main from "../pages/Main";
import Catalog from "../pages/Catalog";
import Product from "../pages/Product";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import RestorePassword from "../pages/RestorePassword";
import Registration from "../pages/Registration";
import Category from "../pages/Category";
import Basket from "../pages/Basket";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Main/>} />
            <Route path="/catalog/:categoryId/:productId" element={<Product/>} />
            <Route path="/catalog/:categoryId" element={<Category/>} />
            <Route path="/catalog" element={<Catalog/>} />
            <Route path="/profile/login" element={<Login/>} />
            <Route path="/profile/restore" element={<RestorePassword/>} />
            <Route path="/profile/registration" element={<Registration/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/basket" element={<Basket/>} />
            <Route path="*" element={<Main/>} />
        </Routes>
    );
};

export default AppRouter;