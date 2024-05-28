import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {authAPI, deleteUser, getUserInfo, updateUserInfo} from "../api/userAPI";
import {Button, Image} from "react-bootstrap";
import styled from "styled-components";
import AddCategory from "../components/modals/AddCategory";
import AddItem from "../components/modals/AddItem";
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
import UpdateButton from "../components/buttons/UpdateButton";
import noImage from "../assets/icon_no_image.svg";

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
    const {user} = useContext(Context);
    const [changeCategories, setChangeCategories] = useState(false);
    const navigate = useNavigate();
    const roles = {
        ADMIN : 'Администратор',
        USER : 'Пользователь'
    }
    const [change, setChange] = useState(false);

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState('');
    const [about, setAbout] = useState('');

    const handleModal = (value) => {
        setChange(value);
    }
    const setUserInfo = (userId) => {
        getUserInfo(userId).then(data => {
            user.setUserInfo(data);

            user.userInfo.name && setName(user.userInfo.name);
            user.userInfo.surname && setSurname(user.userInfo.surname);
            user.userInfo.status && setStatus(user.userInfo.status);
            user.userInfo.about && setAbout(user.userInfo.about);
        }).catch((err) => {
            console.log(err)
        })
    }
    const handlerChangeUserInfo = (userId) => {
        const formData = new FormData();
        userId && formData.append('userId', userId);
        name && formData.append('name', name);
        surname && formData.append('surname', surname);
        status && formData.append('status', status);
        about && formData.append('about', about);
        image && formData.append(`${image[0].name}`, image[0]);
        updateUserInfo(formData).then(data => {
            setUserInfo(userId)
            setChange(false);
        }).catch((err) => {
            console.log(err);
        })
    }
    const deleteUserHandler = (userId) => {
        deleteUser(userId).then(data => {
            user.setAuth(false);
            localStorage.setItem('token', '');
            navigate('/');
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`login`);
        })
    }, [navigate, user]);
    useEffect(() => {
        if (user.isAuth) {
            setUserInfo(user.isAuth.id);
        }
    }, [user.isAuth]);// eslint-disable-line
    function handleExit() {
        localStorage.setItem('token', '');
        user.setAuth(false);
        navigate('/');
    }
    return (
        <Styled>
            <h2>Личный кабинет</h2>
            <h4>{roles[user.isAuth.role]} {user.isAuth.email}</h4>
            <div className={'profile-container'}>
                <div className={'profile-card'}>
                    <Image src={user.userInfo.img ?
                        process.env.REACT_APP_API_URL + user.userInfo.img : noImage}
                           roundedCircle style={{width: '50%', left: "auto", right: 'auto', alignSelf: "center"}}/>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <h2>{user.userInfo.name} {user.userInfo.surname}</h2>
                        <h2>{user.userInfo.phone}</h2>
                        <h3>{user.userInfo.status}</h3>
                        <p>{user.userInfo.about}</p>
                    </div>
                    <UpdateButton handleModal={handleModal} isActive={change} right={'5px'}/>
                </div>
                <div className={'profile-buttons'}>
                    <AddCategory setChangeCategories={setChangeCategories}/>
                    <AddItem changeCategories={changeCategories} setChangeCategories={setChangeCategories}/>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => navigate('orders')}>Мои заказы</Button>
                    <Button variant={'secondary'} onClick={handleExit}>Выйти</Button>
                </div>
            </div>
            <ViewProfile deleteUserHandler={deleteUserHandler} change={change} setChange={setChange} name={name} surname={surname}
                         status={status} about={about} setName={setName} setSurname={setSurname} setImage={setImage}
                         setStatus={setStatus} setAbout={setAbout} handlerChangeUserInfo={handlerChangeUserInfo}/>
        </Styled>
    );
});
export default Profile;