import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {authAPI} from "../http/userAPI";
import {Button} from "react-bootstrap";
import styled from "styled-components";
import AddCategory from "../components/AddCategory";
import AddProduct from "../components/AddProduct";
import ViewProfile from "../components/ViewProfile";

const Styled = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  button {
    width: 300px;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .profile-buttons-block {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
    button {
      width: 100%;
      margin-top: 15px;
      margin-bottom: 15px;
    }
  }
`
const Profile = observer( () => {
    const {user} = useContext(Context);
    const [changeCategories, setChangeCategories] = useState(false);
    const navigate = useNavigate();
    const roles = {
        ADMIN : 'Администратор',
        USER : 'Пользователь'
    }
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`login`);
        })
    }, [navigate, user]);
    function handleExit() {
        localStorage.setItem('token', '');
        user.setAuth(false);
        navigate('/');
    }
    return (
        <Styled>
            <h2>Личный кабинет</h2>
            <h4>{roles[user.isAuth.role]} {user.isAuth.email}</h4>
            <ViewProfile/>
            <div className={'profile-buttons-block'}>
                <AddCategory setChangeCategories={setChangeCategories}/>
                <AddProduct changeCategories={changeCategories} setChangeCategories={setChangeCategories}/>
                <Button variant={"success"} onClick={() => navigate('orders')}>Мои заказы</Button>
                <Button variant="secondary" onClick={handleExit}>Выйти</Button>
            </div>
        </Styled>
    );
});
export default Profile;