import React from 'react';
import {Alert, Button, Modal} from "react-bootstrap";
import styled from "styled-components";
const Styled = styled.div`
  .button-block-yes-no {
    width: 50%;
    display: flex;
    justify-content: space-evenly;
    margin-left: auto;
    margin-right: auto;
    >button {
      width: 80px;
    }
  }
`

const AlertClearHistory = ({showAlert, setShowAlert, clearOrdersHandler}) => {
    return (
        <Modal
            show={showAlert}
            backdrop="static"
            keyboard={false}
        >
            <Styled>
                <Alert style={{zIndex: 999, margin: 0}} variant="danger" onClose={() => setShowAlert(false)} dismissible
                       onClick={(e) => e.stopPropagation()}>
                    <Alert.Heading>Очистить историю заказов ?</Alert.Heading>
                    <p>Восстановить её будет невозможно.</p>
                    <div className={'button-block-yes-no'}>
                        <Button variant={"outline-danger"} onClick={clearOrdersHandler}>Да</Button>
                        <Button variant={"outline-secondary"} onClick={() => {setShowAlert(false)}}>Нет</Button>
                    </div>
                </Alert>
            </Styled>
        </Modal>
    );
};

export default AlertClearHistory;