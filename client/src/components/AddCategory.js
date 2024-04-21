import React, {useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {createCategory} from "../http/itemApi";

const AddCategory = () => {
    const [show, setShow] = useState(false);
    const [categoryName, setCategoryName] = useState('');

    const handleCancel = () => {
        setCategoryName('');
        setShow(false);
    }
    const handleAdd = () => {
        createCategory({categoryName}).then(() => {
            handleCancel();
        })
    }

    return (
        <>
            <Button variant="success" onClick={() => {
                setShow(true);
            }}>
                Добавить категорию
            </Button>
            <Modal
                show={show}
                onHide={() => setShow(false)}
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