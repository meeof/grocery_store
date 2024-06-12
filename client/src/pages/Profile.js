import React, {useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {Button, Image} from "react-bootstrap";
import styled from "styled-components";
import ViewProfile from "../components/modals/ViewProfile";
import {
    breakpoints,
    colors,
    flexColumn,
    freeButtonWidth,
    marginMedium, marginsCenter,
    marginSmall,
    marginsPage
} from "../StyledGlobal";
import noImage from "../assets/icon_no_image.svg";
import Load from "../components/Load";
import CategoryAddUpdate from "../components/modals/CategoryAddUpdate";
import ItemAddUpdate from "../components/modals/ItemAddUpdate";

const Styled = styled.div`
  ${marginsPage};
  ${flexColumn};
  align-items: center;
  * {
    text-align: center;
  }
  .profile-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    ${marginsCenter};
    position: relative;
    > {
      &:first-child {
        grid-column: 2/3;
        grid-row: 1/2;
      }
      &:last-child {
        grid-column: 1/2;
        grid-row: 1/2;
      }
    }
    .profile-card {
      ${flexColumn};
      overflow: hidden;
    }
    .profile-buttons {
      ${flexColumn};
      justify-content: flex-start;
      button {
        max-width: ${freeButtonWidth};
        margin-top: ${marginMedium};
        margin-bottom: ${marginMedium};
      }
    }
    @media (${breakpoints.fromExtraLarge}) {
      width: 50%;
    }
    @media (${breakpoints.fromLarge}) and (${breakpoints.extraLarge}){
      width: 60%;
    }
    @media (${breakpoints.fromMedium}) and (${breakpoints.large}){
      width: 70%;
    }
    @media (${breakpoints.fromSmall}) and (${breakpoints.medium}){
      width: 80%;
    }
    @media (${breakpoints.small}) {
      ${flexColumn};
      width: 100%;
      .profile-buttons {
        button {
          max-width: 100%;
          margin-top: ${marginSmall};
          margin-bottom: ${marginSmall};
        }
      }
    }
  }
`
const Profile = observer( () => {
    const navigate = useNavigate();
    const {user, basket} = useContext(Context);
    const roles = {
        ADMIN : 'Администратор',
        USER : 'Пользователь'
    }
    useEffect(() => {
        user.fetchUserInfo(navigate);
    }, [user, navigate]);
    return (
        <>
            {user.isAuth ? <Styled>
                <h2>Личный кабинет</h2>
                <h4>{roles[user.isAuth.role]} {user.isAuth.email}</h4>
                <div className={'profile-container'}>
                    {user.userInfo ? <div className={'profile-card'}>
                        <Image src={user.userInfo.img ?
                            process.env.REACT_APP_API_URL + user.userInfo.img : noImage}
                               roundedCircle style={{width: '50%', left: "auto", right: 'auto', alignSelf: "center"}}/>
                        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                            <h2>{user.userInfo.name} {user.userInfo.surname}</h2>
                            <h2>{user.isAuth.phone}</h2>
                            <h3>{user.userInfo.status}</h3>
                            <p>{user.userInfo.about}</p>
                        </div>
                        {user.userInfo && <ViewProfile/>}
                    </div> : <Load/>}
                    <div className={'profile-buttons'}>
                        <CategoryAddUpdate/>
                        <ItemAddUpdate fullForm={true}/>
                        <Button variant={colors.bootstrapMainVariant} onClick={() => {
                            basket.setOrders(null);
                            navigate('orders');
                        }}>Мои заказы</Button>
                        <Button variant={'secondary'} onClick={() => user.userExit(navigate)}>Выйти</Button>
                    </div>
                </div>
            </Styled> : <Load/>}
        </>
    );
});
export default Profile;