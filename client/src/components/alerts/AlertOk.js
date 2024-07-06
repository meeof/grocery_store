import React from 'react';
import {Alert, Button, Modal} from "react-bootstrap";
import {Theme} from "../../StyledGlobal";

const AlertOk = ({alertVariant, buttonVariant, show, setShow, text}) => {
    return (
        <Modal
            show={show}
            backdrop="static"
            keyboard={false}
        >
            <Alert data-bs-theme={Theme.dark ? "dark" : "light"} show={show} variant={alertVariant}
                   style={{margin: 0, display: "flex", flexDirection: "column", alignItems: "center"}}>
                <Alert.Heading style={{marginBottom: '40px'}}>{text}</Alert.Heading>
                <Button onClick={() => setShow(false)} variant={buttonVariant} style={{width: '100px'}}>
                    Ок
                </Button>
            </Alert>
        </Modal>
    );
};

export default AlertOk;