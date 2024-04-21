import React, {useContext, useState} from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {loginAPI} from "../http/userAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
const Styled = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  .email-label:after, .password-label:after {
    content: ' *';
    color: red;
  }
  .button-container {
    display: flex;
    button {
      width: 300px;
    }
    .link-register, .link-restore {
      color: #1f7d63;
      text-decoration: underline;
      margin-left: 20px;
      display: flex;
      align-items: center;
      text-align: center;
    }
  }
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
    .button-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      button {
        grid-column: 1/4;
        grid-row: 1/2;
        width: 100%;
      }
      .link-register, .link-restore {
        grid-row: 2/2;
        margin-left: 0;
        justify-content: center;
      }
      .link-register {
        grid-column: 2/3;
      }
      .link-restore {
        grid-column: 1/2;
      }
    }
  }
  @media (max-width: 359.5px) {
    .link-restore {
      grid-column: 1/3 !important;
      grid-row: 2/3 !important;
      width: 100%;
      margin-left: 0;
      justify-content: center;
    }
    .link-register {
      grid-column: 1/3 !important;
      grid-row: 3/4 !important;
      width: 100%;
      margin-left: 0;
      justify-content: center;
    }
  }
  @media (min-width: 992px) {
    .form-control {
      width: 50%;
    }
  }
`

const Login = observer (() => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [phoneEmail, setPhoneEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = () => {
        loginAPI({phoneEmail, password}).then((data) => {
            user.setAuth(data);
            navigate('/profile');
        });
    }
    return (
        <Styled>
            <h2>Вход в кабинет покупателя</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className={'email-label'}>Телефон или Email</Form.Label>
                    <Form.Control type="text" value={phoneEmail} onChange={(e) => setPhoneEmail(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label className={'password-label'}>Пароль</Form.Label>
                    <Form.Control type="password" autoComplete={'off'} value={password}
                                  onChange={(e) => setPassword(e.target.value)}/>
                </Form.Group>
                <div className={'button-container'}>
                    <Button variant="success" onClick={handleLogin}>Войти</Button>
                    <div role={"button"} className={'link-restore'}
                         onClick={() => navigate('/profile/restore')}>Восстановить пароль</div>
                    <div role={"button"} className={'link-register'}
                         onClick={() => navigate('/profile/registration')}>Зарегистрироваться</div>
                </div>
            </Form>
        </Styled>
    );
});

export default Login;