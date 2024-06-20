import React, {useContext} from 'react';
import {Alert, Button, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {Context} from "../../index";
import {useTheme} from "styled-components";
import {standardValues} from "../../StyledGlobal";

const AlertOrdered = ({field, showAlert, setShowAlert}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {basket} = useContext(Context);
    return (
        <Modal
            show={showAlert}
            backdrop="static"
            keyboard={false}
        >
            <Alert show={showAlert} variant="success" style={{margin: 0}}>
                <Alert.Heading>Заказ сформирован!</Alert.Heading>
                <p>
                    Детали и статус заказа вы всегда можете посмотреть у себя в профиле.
                </p>
                <hr />
                <div className="d-flex justify-content-end">
                    <Button onClick={async () => {
                        setShowAlert(false);
                        if (field === 'page') {
                            basket.setBasket(null);
                            navigate('/catalog');
                        }
                    }} variant={theme.colors.bootstrapMainVariant} style={{width: standardValues.smallButtonWidth}}>
                        Ок
                    </Button>
                </div>
            </Alert>
        </Modal>
    );
};

export default AlertOrdered;