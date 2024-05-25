import React, {useRef, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createCategory} from "../../api/itemAPI";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import useWindowSize from "../../hooks/useWindowSize";

const AddCategory = ({setChangeCategories}) => {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    let width = useWindowSize();
    const [showOverlay, setShowOverlay] = useState(false);
    const target = useRef(null);
    const [overlayMessage, setOverlayMessage] = useState('-');
    const [overlayColor, setOverlayColor] = useState('rgba(13, 110, 253, 0.85)');
    const overlayHandle = () => {
        setShowOverlay(true);
        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    }
    const handleCancel = () => {
        setCategoryName('');
        setShowModal(false);
    }
    const handleAdd = () => {
        createCategory({categoryName}).then((data) => {
            if (data === categoryName) {
                setOverlayMessage(`Категория "${data}" успешно добавлена`);
                setOverlayColor('rgba(13, 110, 253, 0.85)');
                handleCancel();
            }
            else {
                setOverlayMessage(data);
                setOverlayColor('rgba(255, 100, 100, 0.85)');
                setShowModal(false);
            }
        }).catch(err => {
            setOverlayMessage('Непредвиденная ошибка');
            setOverlayColor('rgba(255, 100, 100, 0.85)');
        })
        overlayHandle();
        setChangeCategories(true);
    }
    return (
        <>
            <Button variant="success" ref={target} onClick={() => {
                setShowModal(true);
            }}>
                Добавить категорию
            </Button>
            <CustomOverlay show={showOverlay} color={overlayColor} message={overlayMessage}
                           target={target} placement={width > 576 ? "right" : "bottom-start"}/>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Добавление категории товара</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicCategory">
                            <Form.Label className={'category-label'}>Наименование категории</Form.Label>
                            <Form.Control type="text" value={categoryName}
                                          onChange={(e) => setCategoryName(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Отменить
                    </Button>
                    <Button variant="success" onClick={handleAdd}>Добавить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddCategory;