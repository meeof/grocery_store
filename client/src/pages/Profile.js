import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {authAPI} from "../http/userAPI";
import {Button} from "react-bootstrap";
import styled from "styled-components";
import AddCategory from "../components/AddCategory";
import AddProduct from "../components/AddProduct";

const Styled = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
  }
  button {
    width: 300px;
  }
`
const Profile = observer( () => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const roles = {
        ADMIN : 'Администратор',
        USER : 'Пользователь'
    }
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            navigate(`login`);
        })
    }, [navigate, user]);
    function handleExit() {
        localStorage.setItem('token', '');
        navigate('/');
    }
    return (
        <Styled>
            <h2>Личный кабинет</h2>
            <h4>{roles[user.isAuth.role]} {user.isAuth.email}</h4>
            <AddCategory/>
            <AddProduct/>
            <Button variant="secondary" onClick={handleExit}>Выйти</Button>
        </Styled>
    );
});
export default Profile;