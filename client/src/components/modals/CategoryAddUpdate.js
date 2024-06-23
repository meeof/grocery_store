import React, {useContext, useState} from 'react';
import UpdateButton from "../buttons/UpdateButton";
import {Button, Form, Modal} from "react-bootstrap";
import {breakpoints, staticColors, standardValues, Theme} from "../../StyledGlobal";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import {Context} from "../../index";
import useWindowSize from "../../hooks/useWindowSize";
import {API, authAPI} from "../../api";
import {observer} from "mobx-react-lite";
import {useTheme} from "styled-components";


const CategoryAddUpdate = observer(({id, name}) => {
    const theme = useTheme();
    const width = useWindowSize();
    const {overlay, category} = useContext(Context);
    const [categoryName, setCategoryName] = useState(name ? name : '');
    const [showModal, setShowModal] = useState(false);
    const handleCancel = () => {
        name ? setCategoryName(name) : setCategoryName('');
        setShowModal(false);
        overlay.setShow(false);
    }
    const handlerCategory = () => {
        authAPI('post', '/api/categories', {id, categoryName}).then((data) => {
            if (id) {
                setShowModal(false);
                API('get', '/api/categories').then(data => {
                    category.setCategories(data);
                });
            }
            else {
                overlay.setMessage(`Категория "${data}" успешно добавлена`);
                overlay.setColor(theme.colors.mainOpacity);
                overlay.handlerOverlay();
                setCategoryName('');
                setShowModal(false);
            }
        }).catch(err => {
            !id && setShowModal(false);
            overlay.setMessage(err.response?.data || 'Непредвиденная ошибка');
            overlay.setColor(staticColors.opacityRed);
            overlay.handlerOverlay();
        })
    }
    return (
        <div onClick={(e) => e.stopPropagation()}
             style={{width: '100%', display: "flex", justifyContent: "flex-start"}}>
            {id ? <UpdateButton handleModal={setShowModal} isActive={showModal}/> :
                <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                    setShowModal(true);
                    overlay.setTarget(e.target);
                    overlay.setShow(false);
            }} style={width >= breakpoints.rawFromSmall ? {width: standardValues.freeButtonWidth} : {width: '100%'}}>
                Добавить категорию
            </Button>}
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    overlay.setShow(false);
                }}
                backdrop="static"
                keyboard={false}
                data-bs-theme={Theme.dark ? "dark" : "light"}
                style={{color: theme.colors.textColor}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        {id ? 'Редактирование категории товара' : 'Добавление категории товара'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formCategoryAddUpdate">
                            <Form.Label>Наименование категории</Form.Label>
                            <Form.Control type="text" value={categoryName}
                                          onChange={(e) => setCategoryName(e.target.value)}/>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel} style={{color: theme.colors.btnTextColor}}>
                        Отменить
                    </Button>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                        handlerCategory();
                        id && overlay.setTarget(e.target)
                    }} style={{color: theme.colors.btnTextColor}}>{id ? 'Изменить' : 'Добавить'}</Button>
                </Modal.Footer>
            </Modal>
            <CustomOverlay show={overlay.show} color={overlay.color} target={overlay.target} message={overlay.message}/>
        </div>
    );
});

export default CategoryAddUpdate;