import React, {useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../../index";
import useWindowSize from "../../hooks/useWindowSize";
import {observer} from "mobx-react-lite";
import UpdateButton from "../buttons/UpdateButton";
import {Button, Dropdown, DropdownButton, Form, Modal} from "react-bootstrap";
import ItemInfoField from "../item/ItemInfoField";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import {colors} from "../../StyledGlobal";
import {API, authAPI} from "../../api";

const UpdateItem = observer(  ({product, page, fetchItems, right}) => {
    const {item} = useContext(Context);
    const [showModal, setShowModal] = useState(false);

    const [name, setName] = useState(product.name);
    const [price, setPrice] = useState(product.price);
    const [discount, setDiscount] = useState(product.discount);
    const [selected, setSelected] = useState({});
    const [info, setInfo] = useState(product?.info || []);
    const [images, setImages] = useState([]);

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
    const handleModal = (value) => {
        setShowModal(value);
    }
    const handleSelect = (key) => {
        setSelected(item?.categories?.[key]);
    };
    const handleCancel = () => {
        setName(product.name);
        setPrice(product.price);
        setDiscount(product.discount);
        setInfo(product.info);
        setShowModal(false);
        const indexThisCategory = item.categories.findIndex(({id}) => id === product.categoryId);
        setSelected(item?.categories?.[indexThisCategory]);
    }
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
    const upProduct = (id) => {
        const formData = new FormData();
        formData.append('id', id);
        product.name !== name && formData.append('name', name);
        product.price !== Number(price) && formData.append('price', price);
        product.discount !== Number(discount) && formData.append('discount', discount);
        (page && product.categoryId !== selected.id) && formData.append('categoryId', selected.id);
        (page && JSON.stringify(product.info) !== JSON.stringify(info)) && formData.append('info', JSON.stringify(info));
        if (page) {
            for (const [key, value] of Object.entries(images)) {
                formData.append(`${key}_${value.name}`, value)
            }
        }
        authAPI('patch', '/api/item', formData).then(data => {
            if (page) {
                API('get','/api/item/one', {id: product.id}).then(data => {
                    item.setOneItem(data);
                })
            }
            else {
                fetchItems();
            }
            handleCancel();
        }).catch(err => {
            setOverlayMessage(err.response?.data || 'Непредвиденная ошибка');
            overlayHandle();
        });
    }
    useEffect(() => {
        API('get', '/api/categories').then(data => {
            item.setCategories(data);
            const indexThisCategory = item.categories.findIndex(({id}) => id === product.categoryId);
            setSelected(item?.categories?.[indexThisCategory]);
        })
    }, [item, product.categoryId]);
    useEffect(() => {
        setName(product.name);
        setPrice(product.price);
        setDiscount(product.discount);
        setInfo(product?.info || []);
        setShowModal(false);
    }, [product.categoryId, item?.categories, product.discount, product?.info, product.name, product.price]);
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <UpdateButton handleModal={handleModal} right={right} isActive={showModal}/>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{page ? 'Редактирование товара' : 'Частичное редактирование товара'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formUpdateItemName">
                            <Form.Label>Наименование товара</Form.Label>
                            <Form.Control type="text" value={name}
                                          onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        {page && <Form.Group className="mb-3" controlId="formUpdateItemCategory">
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
                        </Form.Group>}
                        <Form.Group className="mb-3" controlId="formUpdateItemPrice">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control type="number" value={price}
                                          onChange={(e) => setPrice(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formUpdateItemDiscount">
                            <Form.Label>Скидка %</Form.Label>
                            <Form.Control type="number" value={discount}
                                          onChange={(e) => setDiscount(e.target.value)}/>
                        </Form.Group>
                        {page && <Form.Group className="mb-3" controlId="formUpdateItemPhoto">
                            <Form.Label>Фото</Form.Label>
                            <Form.Control type="file" accept="image/*"  multiple onChange={(event) => {
                                setImages(event.target.files);
                            }}/>
                        </Form.Group>}
                        {page && <Form.Group className="mb-3" controlId="formUpdateItemChar" style={{display: "flex", flexDirection: "column"}}>
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
                        </Form.Group>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Отменить
                    </Button>
                    <Button variant={colors.bootstrapMainVariant} ref={target} onClick={() => upProduct(product.id)}>Изменить</Button>
                    <CustomOverlay show={showOverlay} color={colors.opacityRed} message={overlayMessage}
                                   target={target} placement={width > 576 ? "right" : "bottom-start"}/>
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default UpdateItem;