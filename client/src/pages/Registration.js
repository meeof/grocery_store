import React, {useContext, useRef, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, DropdownButton, Dropdown, Form} from "react-bootstrap";
import styled from "styled-components";
import {Context} from "../index";
import {registrationAPI} from "../http/userAPI";
import useWindowSize from "../hooks/useWindowSize";
import Ovr from "../components/miniComponents/Ovr";
const Styled = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  .email-label:after {
    content: ' *';
    color: red;
  }
  .button-container {
    display: flex;
    button {
      width: 300px;
    }
    .link-login {
      color: #1f7d63;
      text-decoration: underline;
      margin-left: 20px;
      display: flex;
      align-items: center;
      text-align: center;
    }
  }
  .dropdown-toggle, .dropdown-item {
    width: 100%;
  }
  .dropdown-menu {
    width: 50%;
  }
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
    .button-container {
      flex-direction: column;
      align-items: center;
      button {
        width: 100%;
      }
    }
  }
  @media (min-width: 992px) {
    .form-control, .dropdown-toggle, .dropdown-item {
      width: 50%;
    }
    .dropdown-menu {
      width: 25%;
    }
  }
`
const Registration = () => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const languages = ['Русский', 'English'];
    const [selected, setSelected] = useState(languages[0]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

    const [showOverlay, setShowOverlay] = useState(false);
    const target = useRef(null);
    const [overlayMessage, setOverlayMessage] = useState('-');
    let width = useWindowSize();
    const overlayHandle = () => {
        setShowOverlay(true);
        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    }

    const handleSelect = (key) => {
        setSelected(key);
    };
    const handleRegistration = (e) => {
        e.preventDefault();
        if (password === repeatPassword) {
            registrationAPI(
                {name, surname, phone, email, password, language: selected}
            ).then((data) => {
                user.setAuth(data);
                navigate('/profile');
            }).catch(err => {
                setOverlayMessage(err.response.data);
                overlayHandle();
            })
        }
        else {
            setOverlayMessage('Пароли не совпадают');
            overlayHandle()
        }
    }
    return (
        <Styled>
            <h2>Регистрация</h2>
            <Form onSubmit={(e) => handleRegistration(e)}>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label className={'email-label'}>Имя</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Label className={'email-label'}>Фамилия</Form.Label>
                    <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className={'email-label'}>Email</Form.Label>
                    <Form.Control type={'email'} value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label className={'email-label'}>Телефон</Form.Label>
                    <Form.Control type={'tel'} value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLanguage">
                    <div className={'mb-2'}>Язык</div>
                    <DropdownButton
                        onSelect={handleSelect}
                        id={`languages-group`}
                        variant={'outline-secondary'}
                        title={selected}
                    >
                        {languages.map((lang, index) => {
                            return <Dropdown.Item key={index} eventKey={lang}>{lang}</Dropdown.Item>
                        })}
                    </DropdownButton>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className={'email-label'}>Пароль</Form.Label>
                    <Form.Control type="password" autoComplete={'off'} value={password}
                                  onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
                    <Form.Label className={'email-label'}>Повторите пароль</Form.Label>
                    <Form.Control type="password" autoComplete={'off'} value={repeatPassword}
                                  onChange={(e) => setRepeatPassword(e.target.value)}/>
                </Form.Group>
                <div className={'button-container'}>
                    <Button ref={target} type={"submit"} variant="success">Зарегистрироваться</Button>
                    <Ovr show={showOverlay} color={'rgba(255, 100, 100, 0.85)'} message={overlayMessage}
                         target={target} placement={width > 576 ? "right" : "bottom-start"}/>
                    <div role={"button"} className={'link-login'}
                         onClick={() => navigate('/profile/login')}>У меня уже есть аккаунт</div>
                </div>
            </Form>
        </Styled>
    );
};

export default Registration;