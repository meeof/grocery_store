import React, {useRef, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createCategory} from "../../api/itemAPI";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import useWindowSize from "../../hooks/useWindowSize";
import {colors} from "../../StyledGlobal";

const AddCategory = ({setChangeCategories}) => {
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    let width = useWindowSize();
    const [showOverlay, setShowOverlay] = useState(false);
    const target = useRef(null);
    const [overlayMessage, setOverlayMessage] = useState('-');
    const [overlayColor, setOverlayColor] = useState(colors.opacityPrimary);
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
                setOverlayColor(colors.opacityPrimary);
                handleCancel();
            }
            else {
                setOverlayMessage(data);
                setOverlayColor(colors.opacityRed);
                setShowModal(false);
            }
        }).catch(err => {
            setOverlayMessage('Непредвиденная ошибка');
            setOverlayColor(colors.opacityRed);
        })
        overlayHandle();
        setChangeCategories(true);
    }
    return (
        <>
            <Button variant={colors.bootstrapMainVariant} ref={target} onClick={() => {
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
                        <Form.Group className="mb-3" controlId="formAddCategory">
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
                    <Button variant={colors.bootstrapMainVariant} onClick={handleAdd}>Добавить</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddCategory;