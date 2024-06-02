import React, {useContext, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Dropdown, DropdownButton, Form} from "react-bootstrap";
import CustomOverlay from "../components/badges_and_overlays/CustomOverlay";
import {Context} from "../index";
import useWindowSize from "../hooks/useWindowSize";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {
    breakpoints,
    colors,
    flexColumn,
    freeButtonWidth, importantStar,
    marginMedium,
    marginSmall,
    marginsPage
} from "../StyledGlobal";
import {decodeAuthAPI} from "../api";

const Styled = styled.div`
  margin-bottom: ${marginSmall};
  ${marginsPage};
  .input-label:after {
    ${importantStar};
  }
  .button-container {
    display: flex;
    button {
      width: ${freeButtonWidth};
    }
    .link-underline {
      color: ${colors.main};
      text-decoration-color: ${colors.main} !important;
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
  @media (${breakpoints.fromLarge}) {
    .form-control, .dropdown-toggle, .dropdown-item {
      width: 50%;
    }
    .dropdown-menu {
      width: 25%;
    }
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
`

const LoginRegistrationRestore = observer(() => {
    console.log('render LOGIN');
    const languages = ['Русский', 'English'];
    const {user, overlay} = useContext(Context);
    const navigate = useNavigate();
    const width = useWindowSize();
    const location = useLocation();
    //data for login page
    const [enterLogin, setEnterLogin] = useState('');
    const [enterPassword, setEnterPassword] = useState('');
    //data for registration page
    const [language, setLanguage] = useState(languages[0]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    //data for restore
    const [restoreLogin, setRestoreLogin] = useState('');

    const handlerLoginRegistration = (e) => {
        e.preventDefault();
        switch (e.target.id) {
            case 'formRegistration':
                if (password === repeatPassword) {
                    decodeAuthAPI('post', '/api/user/registration',
                        {name, surname, phone, email, password, language}).then((data) => {
                        user.setAuth(data);
                        navigate('/profile');
                    }).catch(err => {
                        overlay.setMessage(err.response.data);
                        overlay.handlerOverlay();
                    })
                } else {
                    overlay.setMessage('Пароли не совпадают');
                    overlay.handlerOverlay();
                }
                break;
            default :
                decodeAuthAPI('post','/api/user/login', {enterLogin, enterPassword}).then((data) => {
                    user.setAuth(data);
                    navigate(-1);
                }).catch(err => {
                    overlay.setMessage(err.response.data);
                    overlay.handlerOverlay();
                });
                break;
        }
    }
    let page;
    switch(location.pathname) {
        case '/profile/registration':
            page = <Styled>
                <h2>Регистрация</h2>
                <Form id={'formRegistration'} onSubmit={(e) => handlerLoginRegistration(e)}>
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
                            onSelect={(key => setLanguage(key))}
                            id={`languages-group`}
                            variant={colors.bootstrapMainVariantOutline}
                            title={language}
                        >
                            <>
                                {languages.map((lang, index) => {
                                    return <Dropdown.Item key={index} eventKey={lang}>{lang}</Dropdown.Item>
                                })}
                            </>
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
                        <Button onClick={e => overlay.setTarget(e.target)} type={"submit"} variant={colors.bootstrapMainVariant}>Зарегистрироваться</Button>
                        <CustomOverlay show={overlay.show} color={colors.opacityRed} message={overlay.message}
                                       target={overlay.target} placement={width > 576 ? "right" : "bottom-start"}/>
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
                        <Form.Control type="text" value={restoreLogin} onChange={e => {
                            setRestoreLogin(e.target.value);
                        }}/>
                    </Form.Group>
                    <div className={'button-container'}>
                        <Button variant={colors.bootstrapMainVariant} type="submit">Восстановить пароль</Button>
                        <div role={"button"} className={'link-underline'}
                             onClick={() => navigate('/profile/login')}>Я вспомнил(-а) пароль!</div>
                    </div>
                </Form>
            </Styled>
            break
        default:
            page = <Styled>
                <h2>Вход в кабинет покупателя</h2>
                <Form id={'formLogin'} onSubmit={(e) => handlerLoginRegistration(e)}>
                    <Form.Group className="mb-3" controlId="formLoginEmail">
                        <Form.Label className={'input-label'}>Телефон или Email</Form.Label>
                        <Form.Control type="text" value={enterLogin} onChange={(e) => setEnterLogin(e.target.value)}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formLoginPassword">
                        <Form.Label className={'input-label'}>Пароль</Form.Label>
                        <Form.Control type="password" autoComplete={'off'} value={enterPassword}
                                      onChange={(e) => setEnterPassword(e.target.value)}/>
                    </Form.Group>
                    <div className={'button-container'}>
                        <Button onClick={e => overlay.setTarget(e.target)} variant={colors.bootstrapMainVariant} type={"submit"}>Войти</Button>
                        <CustomOverlay show={overlay.show} color={colors.opacityRed} message={overlay.message}
                                       target={overlay.target} placement={width > 576 ? "right" : "bottom-start"}/>
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