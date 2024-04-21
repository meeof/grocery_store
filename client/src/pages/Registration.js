import React, {useState} from 'react';
import {useNavigate} from "react-router-dom";
import {Button, DropdownButton, Dropdown, Form} from "react-bootstrap";
import styled from "styled-components";
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
    const navigate = useNavigate();
    const languages = ['Русский', 'English'];
    const [selected, setSelected] = useState(languages[0]);
    const handleSelect = (key) => {
        setSelected(key);
    };
    return (
        <Styled>
            <h2>Регистрация</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label className={'email-label'}>Имя</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicSurname">
                    <Form.Label className={'email-label'}>Фамилия</Form.Label>
                    <Form.Control type="text"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label className={'email-label'}>Email</Form.Label>
                    <Form.Control type={'email'}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label className={'email-label'}>Телефон</Form.Label>
                    <Form.Control type={'tel'}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicLanguage">
                    <Form.Label>Язык</Form.Label>
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
                    <Form.Control type="password" autoComplete={'off'}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicRepeatPassword">
                    <Form.Label className={'email-label'}>Повторите пароль</Form.Label>
                    <Form.Control type="password" autoComplete={'off'}/>
                </Form.Group>
                <div className={'button-container'}>
                    <Button variant="success" type="submit">Зарегистрироваться</Button>
                    <div role={"button"} className={'link-login'}
                         onClick={() => navigate('/profile/login')}>У меня уже есть аккаунт</div>
                </div>
            </Form>
        </Styled>
    );
};

export default Registration;