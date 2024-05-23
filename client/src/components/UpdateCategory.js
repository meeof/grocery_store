import React, {useContext, useRef, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import UpdateButton from "./miniComponents/UpdateButton";
import useWindowSize from "../hooks/useWindowSize";
import Ovr from "./miniComponents/Ovr";
import {fetchCategories, updateCategory} from "../http/itemAPI";
import {observer} from "mobx-react-lite";
import {Context} from "../index";

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
        updateCategory(body).then((data) => {
            if (data !== 'success') {
                setOverlayMessage(data);
                overlayHandle();
            }
            else {
                fetchCategories().then(data => {
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
                        <Form.Group className="mb-3" controlId="formBasicCategoryUp">
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
                    <Button variant="success" ref={target} onClick={() => upCategory({id, categoryName})}>Изменить</Button>
                    <Ovr show={showOverlay} color={'rgba(255, 100, 100, 0.85)'} message={overlayMessage}
                         target={target} placement={width > 576 ? "right" : "bottom-start"}/>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default UpdateCategory;