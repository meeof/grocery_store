import React, {useState} from 'react';
import styled from "styled-components";
import {Modal} from "react-bootstrap";
import OrderForm from "./OrderForm";
import AlertOrdered from "./miniComponents/AlertOrdered";
const Styled = styled.div`
  @keyframes shopButtonAnim {
    0% {
      background: transparent;
    }
    25% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), transparent, transparent, transparent);
    }
    50% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), transparent ,transparent);
    }
    75% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), transparent);
    }
    100% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7));
    }
  }
  width: 100%;
  color: #1f7d63;
  font-weight: bold;
  margin-bottom: 10px;
  border: solid 1px #1f7d63;
  border-radius: 5px;
  padding: 5px;
  text-align: center;
  &:hover {
    animation-name: shopButtonAnim;
    animation-duration: 200ms;
    animation-timing-function: ease-in-out;
    animation-fill-mode: forwards;
    color: white;
  }
`

const OneClickBuy = ({itemId}) => {
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    return (
        <>
            <Styled role={"button"} className={'one-click-buy'} onClick={() => setShowModal(true)}>Купить в 1 клик</Styled>
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