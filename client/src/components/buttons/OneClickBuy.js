import React, {useContext, useState} from 'react';
import styled, {useTheme} from "styled-components";
import {Modal} from "react-bootstrap";
import OrderForm from "../OrderForm";
import AlertOrdered from "../alerts/AlertOrdered";
import {standardValues, Theme} from "../../StyledGlobal";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
const Styled = styled.div`
  ${({theme}) => theme.animations.darkGradient};
  ${({theme}) => theme.animations.lightGradient};
  width: 100%;
  color: ${({theme}) => theme.colors.main};
  font-weight: bold;
  margin-bottom: ${standardValues.marginSmall};
  border: solid 1px ${({theme}) => theme.colors.main};
  border-radius: 5px;
  padding: 6px;
  text-align: center;
  &:hover {
    animation-duration: 250ms;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    color: white;
  }
`

const OneClickBuy = ({itemId}) => {
    const theme = useTheme();
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handlerBuy = () => {
        user.isAuth ? setShowModal(true) : navigate('/profile/login')
    }
    return (
        <>
            <Styled onMouseOver={(e) => {
                e.target.style.animationName = Theme.dark ? 'darkGradient' : 'lightGradient';
            }} onMouseLeave={(e) => {
                e.target.style.animationName = '';
            }} role={"button"} onClick={handlerBuy}>
                Купить в 1 клик
            </Styled>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
                data-bs-theme={Theme.dark ? "dark" : "light"}
                style={{color: theme.colors.textColor}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Быстрое оформление заказа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <OrderForm setShowAlert={setShowAlert} field={'modal'} setShowModal={setShowModal} itemId={itemId}/>
                </Modal.Body>
            </Modal>
            <AlertOrdered field={'modal'} showAlert={showAlert} setShowAlert={setShowAlert}/>
        </>
    );
};

export default OneClickBuy;