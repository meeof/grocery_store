import React, {useContext, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Dropdown, DropdownButton, Form} from "react-bootstrap";
import CustomOverlay from "../components/badges_and_overlays/CustomOverlay";
import {Context} from "../index";
import useWindowSize from "../hooks/useWindowSize";
import {loginAPI, registrationAPI} from "../api/userAPI";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
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
  margin-bottom: ${marginSmall};
  ${marginsPage};
  .input-label:after {
    content: ' *';
    color: red;
  }
  .button-container {
    display: flex;
    button {
      width: ${freeButtonWidth};
    }
    .link-underline {
      color: ${colors.primary};
      text-decoration-color: ${colors.primary} !important;
      text-decoration: underline;
      margin-left: ${marginMedium};
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }
  .dropdown-toggle, .dropdown-item {
    width: 100%;
  }
  .dropdown-menu {
    width: 50%;
  }
  @media (${breakpoints.small}) {
    .button-container {
      ${flexColumn};
      align-items: center;
      button {
        width: 100%;
        margin-bottom: ${marginSmall};
      }
    }
  }
  @media (${breakpoints.fromLarge}) {
    .form-control, .dropdown-toggle, .dropdown-item {
      width: 50%;
    }
    .dropdown-menu {
      width: 25%;
    }
  }
`

const LoginRegistrationRestore = observer(() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [phoneEmail, setPhoneEmail] = useState('');
    const [enterPassword, setEnterPassword] = useState('');

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
    const handleLogin = (e) => {
        e.preventDefault();
        loginAPI({phoneEmail, enterPassword}).then((data) => {
            user.setAuth(data);
            navigate('/profile');
        }).catch(err => {
            setOverlayMessage(err.response.data);
            overlayHandle();
        });
    }



    const languages = ['Русский', 'English'];
    const [selected, setSelected] = useState(languages[0]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');

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
    const [restorePhoneEmail, setRestorePhoneEmail] = useState('');




    const location = useLocation();
    let page = <></>;
    switch(location.pathname) {
        case '/profile/registration':
            page = <Styled>
                <h2>Регистрация</h2>
                <Form onSubmit={(e) => handleRegistration(e)}>
                    <Form.Group className="mb-3" controlId="formRegistrationName">
                        <Form.Label className={'input-label'}>Имя</Form.Label>
                        <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegistrationSurname">
                        <Form.Label className={'input-label'}>Фамилия</Form.Label>
                        <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegistrationEmail">
                        <Form.Label className={'input-label'}>Email</Form.Label>
                        <Form.Control type={'email'} value={email} onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegistrationPhone">
                        <Form.Label className={'input-label'}>Телефон</Form.Label>
                        <Form.Control type={'tel'} value={phone} onChange={(e) => setPhone(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegistrationLanguage">
                        <div className={'mb-2'}>Язык</div>
                        <DropdownButton
                            onSelect={handleSelect}
                            id={`languages-group`}
                            variant={colors.bootstrapVariantOutline}
                            title={selected}
                        >
                            {languages.map((lang, index) => {
                                return <Dropdown.Item key={index} eventKey={lang}>{lang}</Dropdown.Item>
                            })}
                        </DropdownButton>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegistrationPassword">
                        <Form.Label className={'input-label'}>Пароль</Form.Label>
                        <Form.Control type="password" autoComplete={'off'} value={password}
                                      onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formRegistrationRepeatPassword">
                        <Form.Label className={'input-label'}>Повторите пароль</Form.Label>
                        <Form.Control type="password" autoComplete={'off'} value={repeatPassword}
                                      onChange={(e) => setRepeatPassword(e.target.value)}/>
                    </Form.Group>
                    <div className={'button-container'}>
                        <Button ref={target} type={"submit"} variant={colors.bootstrapVariant}>Зарегистрироваться</Button>
                        <CustomOverlay show={showOverlay} color={colors.errorOverlayRed} message={overlayMessage}
                                       target={target} placement={width > 576 ? "right" : "bottom-start"}/>
                        <div role={"button"} className={'link-underline'}
                             onClick={() => navigate('/profile/login')}>У меня уже есть аккаунт</div>
                    </div>
                </Form>
            </Styled>
            break
        case '/profile/restore':
            page = <Styled>
                <h2>Восстановление пароля</h2>
                <Form onSubmit={(e) => {e.preventDefault()}}>
                    <Form.Group className="mb-3" controlId="formRestoreEmail">
                        <Form.Label className={'input-label'}>Телефон или Email</Form.Label>
                        <Form.Control type="text" value={restorePhoneEmail} onChange={e => {
                            setRestorePhoneEmail(e.target.value);
                        }}/>
                    </Form.Group>
                    <div className={'button-container'}>
                        <Button variant={colors.bootstrapVariant} type="submit">Восстановить пароль</Button>
                        <div role={"button"} className={'link-underline'}
                             onClick={() => navigate('/profile/login')}>Я вспомнил(-а) пароль!</div>
                    </div>
                </Form>
            </Styled>
            break
        default:
            page = <Styled>
                <h2>Вход в кабинет покупателя</h2>
                <Form onSubmit={(e) => handleLogin(e)}>
                    <Form.Group className="mb-3" controlId="formLoginEmail">
                        <Form.Label className={'input-label'}>Телефон или Email</Form.Label>
                        <Form.Control type="text" value={phoneEmail} onChange={(e) => setPhoneEmail(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLoginPassword">
                        <Form.Label className={'input-label'}>Пароль</Form.Label>
                        <Form.Control type="password" autoComplete={'off'} value={enterPassword}
                                      onChange={(e) => setEnterPassword(e.target.value)}/>
                    </Form.Group>
                    <div className={'button-container'}>
                        <Button ref={target} variant={colors.bootstrapVariant} type={"submit"}>Войти</Button>
                        <CustomOverlay show={showOverlay} color={'rgba(255, 100, 100, 0.85)'} message={overlayMessage}
                                       target={target} placement={width > 576 ? "right" : "bottom-start"}/>
                        <div role={"button"} className={'link-underline'}
                             onClick={() => navigate('/profile/restore')}>Восстановить пароль</div>
                        <div role={"button"} className={'link-underline'}
                             onClick={() => navigate('/profile/registration')}>Зарегистрироваться</div>
                    </div>
                </Form>
            </Styled>
            break
    }
    return page;
});

export default LoginRegistrationRestore;