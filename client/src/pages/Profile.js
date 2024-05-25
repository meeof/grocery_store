import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {authAPI} from "../api/userAPI";
import {Button} from "react-bootstrap";
import styled from "styled-components";
import AddCategory from "../components/modals/AddCategory";
import AddProduct from "../components/modals/AddProduct";
import ViewProfile from "../components/modals/ViewProfile";
import {
    breakpoints,
    colors,
    flexColumn,
    freeButtonWidth,
    marginMedium,
    marginSmall,
    marginsPage
} from "../StyledGlobal";

const Styled = styled.div`
  ${marginsPage};
  button {
    width: ${freeButtonWidth};
    margin-top: ${marginSmall};
    margin-bottom: ${marginSmall};
  }
  .profile-buttons {
    ${flexColumn};
    justify-content: space-between;
  }
  @media (${breakpoints.small}) {
    button {
      width: 100%;
      margin-top: ${marginMedium};
      margin-bottom: ${marginMedium};
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
            <div className={'profile-buttons'}>
                <AddCategory setChangeCategories={setChangeCategories}/>
                <AddProduct changeCategories={changeCategories} setChangeCategories={setChangeCategories}/>
                <Button variant={colors.bootstrapVariant} onClick={() => navigate('orders')}>Мои заказы</Button>
                <Button variant={'secondary'} onClick={handleExit}>Выйти</Button>
            </div>
        </Styled>
    );
});
export default Profile;