import React, {useContext, useState} from 'react';
import {Button, Form,} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import styled, {useTheme} from "styled-components";
import {importantStar, standardValues, staticColors, Theme} from "../StyledGlobal";
import {authAPI} from "../api";
const StyledForm = styled.form`
  .input-label:after {
    ${importantStar};
  }
  .check-description {
    color: ${ staticColors.inputPlaceholderColor};
    line-height: 1;
  }
  .other-labels {
    font-size: large;
  }
  .check-block {
    width: 100%;
    position: relative;
    border: solid transparent 1px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    margin-bottom: ${standardValues.marginSmall};
    input[type="checkbox"], input[type="radio"] {
      margin-right: ${standardValues.marginSmall};
    }
    input[type="radio"]:checked, input[type="checkbox"]:checked {
      background-color: ${({theme}) => theme.colors.main};
      box-shadow: none;
      border: 3px solid ${({theme}) => theme.colors.main};
    }
  }
  .check-label {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .delivery-variant-block {
    margin-bottom: 10px;
    .check-block:hover {
      border-color: ${({theme}) => theme.colors.lightColor};
    }
    .delivery-locality {
      color: red;
    }
    .delivery-price {
      font-weight: bold;
      margin-left: auto;
    }
    .link-map {
      color: ${({theme}) => theme.colors.main};
      text-decoration: underline;
      position: ${(props) => props.$LinkMapActive ? 'relative' : 'static'}
    }
  }
  textarea {
    width: 100%;
  }
  > button {
    width: 100%;
  }
`

const OrderForm = observer(({field, setShowModal, setShowAlert, itemId}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {user, render} = useContext(Context);
    const [deliveryValue, setDeliveryValue] = useState('pickup');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [delivery, setDelivery] = useState('');
    const [orderComment, setOrderComment] = useState('');
    const [orderAddress, setOrderAddress] = useState('');
    const [subscription, setSubscription] = useState(false);
    const [autoContact, setAutoContact] = useState(false);
    const handlerOrder = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('surname', surname);
        formData.append('phone', phone);
        formData.append('point', delivery);
        formData.append('delivery', deliveryValue);
        formData.append('address', orderAddress);
        formData.append('comment', orderComment);
        formData.append('sms', subscription);
        (field === 'modal') && formData.append('itemId', itemId);
        authAPI('post', '/api/basket/formOrder', formData).then(() => {
            setShowAlert(true);
            if (field === 'modal') {
                setShowModal(false);
                render.forceUpdate();
            }
        }).catch(err => {
            console.log(err);
        })
    };
    const autoContactHandler = () => {
        if (autoContact) {
            setAutoContact(false);
            setName('');
            setSurname('');
            setPhone('');
        }
        else {
            authAPI( 'get', '/api/basket/getContacts').then(data => {
                setName(data.name);
                setSurname(data.surname);
                setPhone(user.isAuth.phone);
            }).catch(err => {
                console.log(err);
            })
            setAutoContact(true);
        }
    }
    return (
        <>
            <StyledForm $LinkMapActive={deliveryValue === 'point'} onSubmit={(e) => handlerOrder(e)}>
                <b>Контактные данные</b>
                <Form.Group className="mb-3 check-block" controlId="formOrderAutoContact">
                    <Form.Check data-bs-theme={Theme.dark ? "dark" : "light"} checked={autoContact} onChange={autoContactHandler}/>
                    <Form.Label className="check-label"></Form.Label>
                    <div>
                        <div className={'other-labels'}>Как в профиле</div>
                        <div className={'check-description'}>
                            Заполнить имя, фамилию и номер телефона из вашего профиля
                        </div>
                    </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formOrderName">
                    <Form.Label className={'input-label'}>Контактное лицо - имя</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formOrderSurname">
                    <Form.Label className={'input-label'}>Контактное лицо - Фамилия</Form.Label>
                    <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formOrderPhone">
                    <Form.Label className={'input-label'}>Контактный телефон</Form.Label>
                    <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                </Form.Group>
                <b>Доставка</b>
                <Form.Group className="mb-3" controlId="formOrderDelivery">
                    <Form.Label className={'input-label'}>Населенный пункт</Form.Label>
                    <Form.Control type="text" value={delivery} onChange={(e) => setDelivery(e.target.value)}/>
                </Form.Group>
                <div className={'delivery-variant-block'}>
                    <div className="check-block">
                        <input data-bs-theme={Theme.dark ? "dark" : "light"} type="radio" name="deliveryVariantRadio" className="form-check-input"
                               id="flexRadioDefault3" value={'point'} checked={deliveryValue === 'point'}
                               onChange={(e) => setDeliveryValue(e.target.value)}/>
                        <label className="check-label" htmlFor="flexRadioDefault3"></label>
                        <div>
                            <div className={'other-labels'}>Доставка в точки самовывоза</div>
                            {deliveryValue === 'point' &&
                                <div className={'delivery-locality'}>
                                    Укажите населенный пункт
                                </div>
                            }
                            <div role={"button"} className={'link-map'}
                                 onClick={() => navigate('/profile/registration')}>Выбрать на карте</div>
                        </div>
                        <div className={'delivery-price'}>
                            + 0 ₽
                        </div>
                    </div>
                    <div className="check-block">
                        <input data-bs-theme={Theme.dark ? "dark" : "light"} type="radio" name="deliveryVariantRadio" className="form-check-input"
                               id="flexRadioDefault2" value={'courier'} checked={deliveryValue === 'courier'}
                               onChange={(e) => setDeliveryValue(e.target.value)}/>
                        <label className="check-label" htmlFor="flexRadioDefault2"></label>
                        <div>
                            <div className={'other-labels'}>Курьером</div>
                            <div className={'check-description'}>
                                Доставка курьером
                            </div>
                        </div>
                        <div className={'delivery-price'}>
                            + 300 ₽
                        </div>
                    </div>
                </div>
                {deliveryValue === 'courier' &&
                    <Form.Group className="mb-3" controlId="formOrderAddress">
                        <label htmlFor="orderAddress">Адрес</label>
                        <Form.Control as={"textarea"} value={orderAddress}
                                  onChange={(e) => setOrderAddress(e.target.value)}/>
                    </Form.Group>
                }
                <Form.Group className="mb-3" controlId="formOrderComment">
                    <label htmlFor="orderComment">Комментарии к заказу</label>
                    <Form.Control as={"textarea"} value={orderComment}
                              onChange={(e) => setOrderComment(e.target.value)}/>
                </Form.Group>
                <Form.Group className="mb-3 check-block" controlId="formOrderSubscription">
                    <Form.Check data-bs-theme={Theme.dark ? "dark" : "light"} checked={subscription} onChange={() => setSubscription(!subscription)}/>
                    <Form.Label className="check-label"></Form.Label>
                    <div>
                        <div className={'other-labels'}>Подписаться на SMS рассылку</div>
                        <div className={'check-description'}>
                            Вы сможете получать сообщения и видеть скидки и акции на товары
                        </div>
                    </div>
                </Form.Group>
                <Button type={"submit"} style={{color: theme.colors.btnTextColor}} variant={theme.colors.bootstrapMainVariant}>Подтвердить</Button>
            </StyledForm>
        </>
    );
});
export default OrderForm;