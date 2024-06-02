import React, {useContext, useRef, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import UpdateButton from "../buttons/UpdateButton";
import useWindowSize from "../../hooks/useWindowSize";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import {colors} from "../../StyledGlobal";
import {API, authAPI} from "../../api";

const UpdateCategory = observer( ({id, name}) => {
    const {item} = useContext(Context);
    const [categoryName, setCategoryName] = useState(name);
    const [showModal, setShowModal] = useState(false);

    let width = useWindowSize();
    const [showOverlay, setShowOverlay] = useState(false);
    const target = useRef(null);
    const [overlayMessage, setOverlayMessage] = useState('-');
    const overlayHandle = () => {
        setShowOverlay(true);
        setTimeout(() => {
            setShowOverlay(false);
        }, 2000);
    }
    const handleModal = (value) => {
        setShowModal(value);
    }
    const handleCancel = () => {
        setCategoryName(name);
        handleModal(false);
    }
    const upCategory = (body) => {
        authAPI('patch', '/api/categories', body).then((data) => {
            if (data !== 'success') {
                setOverlayMessage(data);
                overlayHandle();
            }
            else {
                API('get', '/api/categories').then(data => {
                    item.setCategories(data);
                });
                handleModal(false);
            }
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <UpdateButton handleModal={handleModal} isActive={showModal}/>
            <Modal
                show={showModal}
                onHide={() => handleModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование категории товара</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formUpdateCategory">
                            <Form.Label>Наименование категории</Form.Label>
                            <Form.Control type="text" value={categoryName}
                                          onChange={(e) => setCategoryName(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Отменить
                    </Button>
                    <Button variant={colors.bootstrapMainVariant} ref={target} onClick={() => upCategory({id, categoryName})}>Изменить</Button>
                    <CustomOverlay show={showOverlay} color={colors.opacityRed} message={overlayMessage}
                                   target={target} placement={width > 576 ? "right" : "bottom-start"}/>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default UpdateCategory;