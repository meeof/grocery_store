import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../../index";
import useWindowSize from "../../hooks/useWindowSize";
import {API, authAPI} from "../../api";
import {breakpoints, staticColors, standardValues, Theme} from "../../StyledGlobal";
import {addImagesToFormData} from "../../usefulFunctions";
import {Button, Dropdown, DropdownButton, Form, Modal} from "react-bootstrap";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import InfoLinkField from "../item/InfoLinkField";
import UpdateButton from "../buttons/UpdateButton";
import {observer} from "mobx-react-lite";
import {useTheme} from "styled-components";

const ItemAddUpdate = observer(({product, itemInfo, fullForm, right, top}) => {
    const theme = useTheme();
    const width = useWindowSize();
    const {item, category, overlay, linkInfo} = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [name, setName] = useState(product?.name || '');
    const [price, setPrice] = useState(product?.price || '');
    const [discount, setDiscount] = useState(product?.discount || '');
    const [selected, setSelected] = useState({});
    const [images, setImages] = useState([]);

    const handleCancel = () => {
        setName(product?.name || '');
        setPrice(product?.price || '');
        setDiscount(product?.discount || '');
        linkInfo.setInfos(itemInfo ? JSON.parse(itemInfo) : []);
        let indexThisCategory = 0;
        if (product) {
            indexThisCategory = category.categories.findIndex(({id}) => id === product.categoryId)
        }
        setSelected(category?.categories?.[indexThisCategory]);
        setShowModal(false);
        overlay.setShow(false);
    }
    const handlerProduct = () => {
        let formData = new FormData();
        product && formData.append('id', product.id);
        product?.name !== name && formData.append('name', name);
        product?.price !== Number(price) && formData.append('price', price);
        product?.discount !== Number(discount) && formData.append('discount', discount);
        (fullForm && JSON.stringify(itemInfo) !== JSON.stringify(linkInfo.infos)) && formData.append('info', JSON.stringify(linkInfo.infos));
        if (fullForm && product?.categoryId !== selected.id) {
            formData.append('categoryName', selected.name);
            formData.append('categoryId', selected.id);
        }
        if (fullForm) {
            formData = addImagesToFormData(formData, images);
        }
        authAPI('post', '/api/item', formData).then(data => {
            if (product) {
                if (fullForm) {
                    API('get','/api/item/one', {id: product.id}).then(data => {
                        item.setOneItem(data);
                    })
                }
                else {
                    item.fetchItems(item.page);
                }
                setShowModal(false);
                overlay.setShow(false);
            }
            else {
                overlay.setMessage(`Товар "${data}" успешно добавлен`);
                overlay.setColor(theme.colors.mainOpacity);
                handleCancel();
                overlay.handlerOverlay();
            }
        }).catch(err => {
            overlay.setMessage(err.response?.data || 'Непредвиденная ошибка');
            overlay.setColor(staticColors.opacityRed);
            overlay.handlerOverlay();
            !product && setShowModal(false);
        })
    }
    const handleSelect = (key) => {
        setSelected(category?.categories?.[key]);
    };
    useEffect(() => {
        itemInfo && linkInfo.setInfos(JSON.parse(itemInfo));
        API('get', '/api/categories').then(data => {
            category.setCategories(data);
            const indexThisCategory = category.categories.findIndex(({id}) => id === product?.categoryId);
            setSelected( category?.categories?.[product ? indexThisCategory : 0]);
        })
    }, [category, product, product?.categoryId, itemInfo, linkInfo]);
    return (
        <div onClick={(e) => e.stopPropagation()}
             style={{width: '100%', display: "flex", justifyContent: "flex-start"}}>
            {product ? <UpdateButton top={top} handleModal={setShowModal} right={right} isActive={showModal}/> :
                <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                    setShowModal(true);
                    overlay.setTarget(e.target);
                    overlay.setShow(false);
                }} style={width >= breakpoints.rawFromSmall ? {width: standardValues.freeButtonWidth} : {width: '100%'}}>
                    Добавить товар
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
                    <Modal.Title>{product ? (fullForm ? 'Редактирование товара' : 'Частичное редактирование товара') :
                        'Добавление товара'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formAddUpdateItemName">
                            <Form.Label>Наименование товара</Form.Label>
                            <Form.Control type="text" value={name}
                                          onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        {fullForm && <Form.Group className="mb-3" controlId="formAddUpdateItemCategory">
                            <div className={'mb-2'}>Категория товара</div>
                            <DropdownButton
                                onSelect={handleSelect}
                                id={`categories-group`}
                                variant={'outline-secondary'}
                                title={selected?.name || 'Категории отсутствуют'}
                            >
                                {category?.categories?.map((category, index) => {
                                    return <Dropdown.Item key={index} eventKey={index}>{category?.name}</Dropdown.Item>
                                })}
                            </DropdownButton>
                        </Form.Group>}
                        <Form.Group className="mb-3" controlId="formAddUpdateItemPrice">
                            <Form.Label>Цена</Form.Label>
                            <Form.Control type="number" value={price}
                                          onChange={(e) => setPrice(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAddUpdateItemDiscount">
                            <Form.Label>Скидка %</Form.Label>
                            <Form.Control type="number" value={discount}
                                          onChange={(e) => setDiscount(e.target.value)}/>
                        </Form.Group>
                        {fullForm && <Form.Group className="mb-3" controlId="formAddUpdateItemPhoto">
                            <Form.Label>Фото</Form.Label>
                            <Form.Control type="file" accept="image/*"  multiple onChange={(event) => {
                                setImages(event.target.files);
                            }}/>
                        </Form.Group>}
                        {fullForm && <div className="mb-3" style={{display: "flex", flexDirection: "column"}}>
                            <div className={'mb-2'}>Характеристики</div>
                            {linkInfo.infos.map((infoObj, index) => {
                                return <InfoLinkField
                                    key={index} index={index}
                                    title={infoObj.title}
                                    content={infoObj.content}
                                    handler={linkInfo.handler}
                                    place={'info'}
                                />
                            })}
                            <Button variant={theme.colors.bootstrapMainVariant} onClick={() => linkInfo.handler('create', 'info')}
                                    className={'mt-3'} style={{width: '50%', alignSelf: "center", color: theme.colors.btnTextColor}}
                                    >Добавить характеристику</Button>
                        </div>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel} style={{color: theme.colors.btnTextColor}}>
                        Отменить
                    </Button>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                        product && overlay.setTarget(e.target);
                        handlerProduct();
                    }} style={{color: theme.colors.btnTextColor}}>
                        {product ? 'Изменить' : 'Добавить'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <CustomOverlay show={overlay.show} color={overlay.color} target={overlay.target} message={overlay.message}/>
        </div>
    );
});
export default ItemAddUpdate;