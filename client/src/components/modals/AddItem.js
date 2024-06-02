import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Dropdown, DropdownButton, Form, Modal} from "react-bootstrap";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import ItemInfoField from "../item/ItemInfoField";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import useWindowSize from "../../hooks/useWindowSize";
import {colors} from "../../StyledGlobal";
import {API, authAPI} from "../../api";

const AddItem = observer( ({changeCategories, setChangeCategories}) => {
    const {item} = useContext(Context);
    const [show, setShow] = useState(false);

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

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discount, setDiscount] = useState('');
    const [selected, setSelected] = useState({});
    const [info, setInfo] = useState([]);
    const [images, setImages] = useState([]);

    const handleCancel = () => {
        setName('');
        setPrice('');
        setDiscount('');
        setSelected(item?.categories?.[0]);
        setInfo([]);
        setShow(false);
    }
    const handleAdd = () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('discount', discount);
        formData.append('categoryId', selected.id);
        formData.append('info', JSON.stringify(info));
        for (const [key, value] of Object.entries(images)) {
            formData.append(`${key}_${value.name}`, value)
        }
        authAPI('post', '/api/item', formData).then(data => {
            if (data?.name === name && data?.price === Number(price) && data?.discount === Number(discount)) {
                setOverlayMessage(`Товар "${data.name}" успешно добавлен`);
                setOverlayColor(colors.opacityPrimary);
                handleCancel();
            }
            else {
                setOverlayMessage(data);
                setOverlayColor(colors.opacityRed);
                setShow(false);
            }
        }).catch(err => {
            setOverlayMessage('Непредвиденная ошибка');
            setOverlayColor(colors.opacityRed);
        })
        overlayHandle();
    }
    const deleteInfo = (findIndex) => {
        let newInfo = Object.assign([], info);
        setInfo(newInfo.filter((element, index) => index !== findIndex))
    }
    const changeInfo = (index, text, isTitle) => {
        let newInfo = Object.assign([], info);
        isTitle ? newInfo[index].title = text : newInfo[index].description = text;
        setInfo(newInfo);
    }
    const newInfo = () => {
        let newInfo = Object.assign([], info);
        newInfo.push({
            title: '',
            description: ''
        });
        setInfo(newInfo);
    }
    const handleSelect = (key) => {
        setSelected(item?.categories?.[key]);
    };
    useEffect(() => {
        setChangeCategories(false);
        API('get', '/api/categories').then(data => {
            item.setCategories(data);
            setSelected(item?.categories?.[0]);
        })
    }, [item, changeCategories, setChangeCategories]);
    return (
        <>
            <Button variant={colors.bootstrapMainVariant} ref={target} onClick={() => setShow(true)}>
                Добавить товар
            </Button>
            <CustomOverlay show={showOverlay} color={overlayColor} message={overlayMessage}
                           target={target} placement={width > 576 ? "right" : "bottom-start"}/>
            <Modal
                show={show}
                onHide={() => setShow(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Добавление товара</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formAddItemName">
                            <Form.Label>Наименование товара</Form.Label>
                            <Form.Control type="text" value={name}
                                          onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddItemCategory">
                            <div className={'mb-2'}>Категория товара</div>
                            <DropdownButton
                                onSelect={handleSelect}
                                id={`categories-group`}
                                variant={'outline-secondary'}
                                title={selected?.name || 'Категории отсутствуют'}
                            >
                                {item?.categories.map((category, index) => {
                                    return <Dropdown.Item key={index} eventKey={index}>{category?.name}</Dropdown.Item>
                                })}
                            </DropdownButton>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddItemPrice">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control type="number" value={price}
                                          onChange={(e) => setPrice(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddItemDiscount">
                            <Form.Label>Скидка %</Form.Label>
                            <Form.Control type="number" value={discount}
                                          onChange={(e) => setDiscount(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddItemPhoto">
                            <Form.Label>Фото</Form.Label>
                            <Form.Control type="file" accept="image/*"  multiple onChange={(event) => {
                                setImages(event.target.files);
                            }}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddItemChar" style={{display: "flex", flexDirection: "column"}}>
                            <div className={'mb-2'}>Характеристики</div>
                            {info.map((infoObj, index) => {
                                return <ItemInfoField
                                    key={index} index={index}
                                    title={infoObj.title}
                                    description={infoObj.description}
                                    changeInfo={changeInfo}
                                    deleteInfo={deleteInfo}/>
                            })}
                            <Button variant={colors.bootstrapMainVariant} onClick={newInfo} className={'mt-3'}
                                    style={{width: '50%', alignSelf: "center"}}>Добавить характеристику</Button>
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
});

export default AddItem;