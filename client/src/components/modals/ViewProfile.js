import React, {useContext} from 'react';
import styled from "styled-components";
import {Button, Form, Image, Modal} from "react-bootstrap";
import {Context} from "../../index";
import UpdateButton from "../buttons/UpdateButton";
import noImage from "../../assets/icon_no_image.svg";
import {observer} from "mobx-react-lite";
import DelButton from "../buttons/DelButton";
import {colors} from "../../StyledGlobal";
const Styled = styled.div`
  
`

const ViewProfile = observer (({deleteUserHandler, change, setChange, name, surname, status,
                                   about, setName, setSurname, setImage, setStatus, setAbout, handlerChangeUserInfo}) => {
    const {user} = useContext(Context);
    return (
        <Styled>
            <Modal
                show={change}
                backdrop="static"
                keyboard={false}
                onHide={() => {
                    setChange(false);
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ваш профиль</Modal.Title>
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
                            <textarea id={'aboutUser'} value={about} style={{height: '100px', resize: 'none'}}
                                      onChange={(e) => setAbout(e.target.value)}></textarea>
                        </Form.Group>
                        <div style={{display: "flex", justifyContent: "space-between"}}>
                            <Button style={{width: '40%'}} variant={colors.bootstrapMainVariant}
                                    onClick={() => handlerChangeUserInfo(user.isAuth.id)}>Применить</Button>
                            <Button variant={"secondary"} style={{width: '40%'}}
                                    onClick={() => setChange(false)}>Отмена</Button>
                        </div>
                    </div>
                    <UpdateButton isActive={change}/>
                    <DelButton id={user.isAuth.id} delFun={deleteUserHandler} name={'ваш профиль'}/>
                </Modal.Body>
                <Modal.Footer style={{border: "none", padding: 0}}/>
            </Modal>
        </Styled>
    );
});

export default ViewProfile;