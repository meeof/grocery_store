import React, {useContext, useState} from 'react';
import styled from "styled-components";
import {Modal} from "react-bootstrap";
import OrderForm from "../OrderForm";
import AlertOrdered from "../alerts/AlertOrdered";
import {animations, colors, marginSmall} from "../../StyledGlobal";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
const Styled = styled.div`
  ${animations.getGradient('0.7')};
  width: 100%;
  color: ${colors.main};
  font-weight: bold;
  margin-bottom: ${marginSmall};
  border: solid 1px ${colors.main};
  border-radius: 5px;
  padding: 6px;
  text-align: center;
  &:hover {
    animation-name: shopButtonAnim;
    animation-duration: 250ms;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    color: white;
  }
`

const OneClickBuy = ({itemId}) => {
    const {user} = useContext(Context);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const handlerBuy = () => {
        user.isAuth ? setShowModal(true) : navigate('/profile/login')
    }
    return (
        <>
            <Styled role={"button"} onClick={handlerBuy}>Купить в 1 клик</Styled>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
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