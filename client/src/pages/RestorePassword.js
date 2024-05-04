import React from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
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
    .form-control {
      width: 50%;
    }
  }
`

const RestorePassword = () => {
    const navigate = useNavigate();
    return (
        <Styled>
            <h2>Восстановление пароля</h2>
            <Form onSubmit={(e) => {e.preventDefault()}}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className={'email-label'}>Телефон или Email</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>
                <div className={'button-container'}>
                    <Button variant="success" type="submit">Восстановить пароль</Button>
                    <div role={"button"} className={'link-login'}
                         onClick={() => navigate('/profile/login')}>Я вспомнил(-а) пароль!</div>
                </div>
            </Form>
        </Styled>
    );
};

export default RestorePassword;