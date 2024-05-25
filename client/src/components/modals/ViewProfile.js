import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {Button, Form, Image, Modal} from "react-bootstrap";
import {authAPI, deleteUser, getUserInfo, updateUserInfo} from "../../api/userAPI";
import {useNavigate} from "react-router-dom";
import {Context} from "../../index";
import UpdateButton from "../buttons/UpdateButton";
import noImage from "../../assets/icon_no_image.svg";
import {observer} from "mobx-react-lite";
import DelButton from "../buttons/DelButton";
const Styled = styled.div`
  
`

const ViewProfile = observer (() => {
    const navigate = useNavigate();
    const {user} = useContext(Context);
    const [showModal, setShowModal] = useState(false);
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
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    useEffect(() => {
        if (user.isAuth) {
            setUserInfo(user.isAuth.id);
        }
    }, [user.isAuth]);// eslint-disable-line
    const deleteUserHandler = (userId) => {
        deleteUser(userId).then(data => {
            user.setAuth(false);
            localStorage.setItem('token', '');
            navigate('/');
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <Styled>
            <Button variant={"success"} onClick={() => setShowModal(true)}>Детали профиля</Button>
            <Modal
                show={showModal}
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setShowModal(false);
                    setChange(false);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ваш профиль</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: '#f8f9fa', display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Image src={user.userInfo.img ?
                        process.env.REACT_APP_API_URL + user.userInfo.img : noImage}
                           roundedCircle style={{width: '50%', left: "auto", right: 'auto', alignSelf: "center"}}/>
                    {change ? <div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Form.Group className="mb-3" controlId="formBasicName" style={{marginRight: '20px'}}>
                                <Form.Label>Имя</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicSurname">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3" controlId="formBasicUserPhoto">
                            <Form.Label>Фото профиля</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(event) => {
                                setImage(event.target.files);
                            }}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicStatus">
                            <Form.Label>Статус</Form.Label>
                            <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicAbout" style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="aboutUser" style={{marginBottom: '10px'}}>Описание профиля</label>
                            <textarea id={'aboutUser'} value={about} style={{height: '100px', resize: 'none'}}
                                      onChange={(e) => setAbout(e.target.value)}></textarea>
                        </Form.Group>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button style={{width: '40%'}} variant={"success"}
                                    onClick={() => handlerChangeUserInfo(user.isAuth.id)}>Применить</Button>
                            <Button variant={"secondary"} style={{width: '40%'}}
                                    onClick={() => setChange(false)}>Отмена</Button>
                        </div>
                    </div> : <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <h2>{user.userInfo.name} {user.userInfo.surname}</h2>
                        <h2>{user.userInfo.phone}</h2>
                        <h3>{user.userInfo.status}</h3>
                        <p>{user.userInfo.about}</p>
                    </div>}
                    <UpdateButton handleModal={handleModal} isActive={change}/>
                    <DelButton id={user.isAuth.id} delFun={deleteUserHandler} name={'ваш профиль'}/>
                </Modal.Body>
            </Modal>
        </Styled>
    );
});

export default ViewProfile;