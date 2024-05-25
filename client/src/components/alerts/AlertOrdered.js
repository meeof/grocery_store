import React from 'react';
import {Alert, Button, Modal} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const AlertOrdered = ({field, showAlert, setShowAlert}) => {
    const navigate = useNavigate();
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
                            navigate('/catalog');
                        }
                    }} variant="outline-success">
                        Ок
                    </Button>
                </div>
            </Alert>
        </Modal>
    );
};

export default AlertOrdered;