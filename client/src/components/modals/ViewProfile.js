import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Image, Modal} from "react-bootstrap";
import {Context} from "../../index";
import noImage from "../../assets/icon-picture.svg";
import {observer} from "mobx-react-lite";
import DelButton from "../buttons/DelButton";
import {authAPI} from "../../api";
import {useNavigate} from "react-router-dom";
import UpdateButton from "../buttons/UpdateButton";
import {useTheme} from "styled-components";
import {Theme} from "../../StyledGlobal";

const ViewProfile = observer (() => {
    const theme = useTheme();
    const [change, setChange] = useState(false);
    const navigate = useNavigate();
    const {user} = useContext(Context);
    const [name, setName] = useState(user.userInfo?.name || '');
    const [surname, setSurname] = useState(user.userInfo?.surname || '');
    const [image, setImage] = useState(null);
    const [status, setStatus] = useState(user.userInfo?.status || '');
    const [about, setAbout] = useState(user.userInfo?.about || '');
    const handlerChangeUserInfo = () => {
        const formData = new FormData();
        name && formData.append('name', name);
        surname && formData.append('surname', surname);
        status && formData.append('status', status);
        about && formData.append('about', about);
        image && formData.append(`${image[0].name}`, image[0]);
        authAPI('patch', '/api/user/info', formData).then((data) => {
            if (data === 'Unauthorized') {
                return
            }
            user.fetchUserInfo();
            setChange(false);
        }).catch((err) => {
            console.log(err);
        })
    }
    const deleteUserHandler = () => {
        authAPI('delete', '/api/user').then(data => {
            if (data === 'Unauthorized') {
                return
            }
            user.userExit(navigate);
        }).catch(err => {
            console.log(err)
        })
    }
    useEffect(() => {
        if (!user.userInfo) {
            user.fetchUserInfo();
        }
    }, [user]);
    return (
        <>
            <UpdateButton handleModal={setChange} right={'5px'}/>
            <Modal
                show={change}
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setChange(false);
                }}
                data-bs-theme={Theme.dark ? "dark" : "light"}
                style={{color: theme.colors.textColor}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать профиль</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Image src={user.userInfo.img ?
                        process.env.REACT_APP_API_URL + user.userInfo.img : noImage}
                           roundedCircle style={{width: '50%', left: "auto", right: 'auto', alignSelf: "center"}}/>
                    <div>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Form.Group className="mb-3" controlId="formProfileName" style={{marginRight: '20px'}}>
                                <Form.Label>Имя</Form.Label>
                                <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formProfileSurname">
                                <Form.Label>Фамилия</Form.Label>
                                <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                            </Form.Group>
                        </div>
                        <Form.Group className="mb-3" controlId="formProfilePhoto">
                            <Form.Label>Фото профиля</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(event) => {
                                setImage(event.target.files);
                            }}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProfileStatus">
                            <Form.Label>Статус</Form.Label>
                            <Form.Control type="text" value={status} onChange={(e) => setStatus(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formProfileAbout" style={{display: "flex", flexDirection: "column"}}>
                            <label htmlFor="aboutUser" style={{marginBottom: '10px'}}>Описание профиля</label>
                            <Form.Control as={"textarea"} value={about} style={{height: '100px', resize: 'none'}}
                                      onChange={(e) => setAbout(e.target.value)}/>
                        </Form.Group>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button style={{width: '40%', color: theme.colors.btnTextColor}} variant={theme.colors.bootstrapMainVariant}
                                    onClick={handlerChangeUserInfo}>Применить</Button>
                            <Button variant={"secondary"} style={{width: '40%', color: theme.colors.btnTextColor}}
                                    onClick={() => {
                                        setChange(false)
                                        user.setUserInfo(null);
                                        user.fetchUserInfo();
                                    }}>Отмена</Button>
                        </div>
                    </div>
                    <DelButton delFun={deleteUserHandler} name={'ваш профиль'}/>
                </Modal.Body>
                <Modal.Footer style={{border: "none", padding: 0}}/>
            </Modal>
        </>
    );
});

export default ViewProfile;