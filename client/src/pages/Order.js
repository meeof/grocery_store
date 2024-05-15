import React, {useContext, useEffect, useState} from 'react';
import {authAPI} from "../http/userAPI";
import {createOrder, getAllBasketItems, getContacts} from "../http/basketAPI";
import {Context} from "../index";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import OrderProductCard from "../components/OrderProductCard";
import {observer} from "mobx-react-lite";
import {Alert, Button, Form, Modal} from "react-bootstrap";

const Styled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin-left: 24px;
  margin-right: 24px;
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
  }
  .left-container {
    padding-right: 20px;
    .link-bought {
      color: #1f7d63;
      text-decoration: underline;
    }
    .email-label:after {
      content: ' *';
      color: red;
    }
  }
  .right-container {
    box-shadow: 2px 0 2px inset rgba(0, 0, 0, 0.1);
    padding-left: 20px;
  }
  .radio-description {
    color: gray;
    line-height: 1;
  }
  .delivery-label-container {
    > {
      &:first-child {
        font-size: large;
      }
    }
  }
  .form-check {
    width: 100%;
    position: relative;
    border: solid transparent 1px;
    border-radius: 3px;
    display: flex;
    align-items: center;
  }
  .form-check-label {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .delivery-variant-block {
    margin-bottom: 10px;
    .form-check:hover {
      border-color: lightgray;
    }
    input[type="radio"] {
      margin-right: 20px;
    }
    input[type="radio"]:checked {
      background-color: #1f7d63;
      box-shadow: none;
      border: 3px solid #1f7d63;
    }
    .delivery-locality {
      color: red;
    }
    .delivery-price {
      font-weight: bold;
      margin-left: auto;
    }
    .link-map {
      color: #1f7d63;
      text-decoration: underline;
    }
  }
  textarea {
    width: 100%;
  }
  .order-subscription-group {
    display: flex;
    input[type="checkbox"] {
      margin-right: 10px;
    }
    input[type="checkbox"]:checked {
      background-color: #1f7d63;
    }
  }
`;

const Order = observer( () => {
    const {user, basket} = useContext(Context);
    const navigate = useNavigate();
    const [deliveryValue, setDeliveryValue] = useState('pickup');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [delivery, setDelivery] = useState('');
    const [orderComment, setOrderComment] = useState('');
    const [orderAddress, setOrderAddress] = useState('');
    const [subscription, setSubscription] = useState(false);
    const [autoContact, setAutoContact] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    useEffect(() => {
        if (user.isAuth) {
            getAllBasketItems(user.isAuth.id).then(data => {
                basket.setBasket(data);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [user.isAuth, basket]);
    let allCost = 0;
    const cards = basket.getBasket.map(product => {
        allCost += product.cost * product.amount;
        return <OrderProductCard key={product.itemId} product={product}/>
    });
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
        formData.append('userId', user.isAuth.id);
        createOrder(formData).then(data => {
            if (data === 'success') {
                setShowAlert(true);
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
            getContacts(user.isAuth.id).then(data => {
                setName(data.name);
                setSurname(data.surname);
                setPhone(data.phone);
            }).catch(err => {
                console.log(err);
            })
            setAutoContact(true);

        }
    }

    return (
        <>
            <Styled>
                <div className={'left-container'}>
                    <h2>Оформление заказа</h2>
                    <Form onSubmit={(e) => handlerOrder(e)}>
                        <b>Контактные данные</b>
                        <Form.Group className="mb-3 order-subscription-group form-check" controlId="formBasicAutoContact">
                            <Form.Check value={autoContact} onChange={autoContactHandler}/>
                            <Form.Label className="form-check-label"></Form.Label>
                            <div className={'delivery-label-container'}>
                                <div>Как в профиле</div>
                                <div className={'radio-description'}>
                                    Заполнить имя, фамилию и номер телефона из вашего профиля
                                </div>
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicOrderName">
                            <Form.Label className={'email-label'}>Контактное лицо - имя</Form.Label>
                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicOrderSurname">
                            <Form.Label className={'email-label'}>Контактное лицо - Фамилия</Form.Label>
                            <Form.Control type="text" value={surname} onChange={(e) => setSurname(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicOrderPhone">
                            <Form.Label className={'email-label'}>Контактный телефон</Form.Label>
                            <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}/>
                        </Form.Group>
                        <b>Доставка</b>
                        <Form.Group className="mb-3" controlId="formBasicDelivery">
                            <Form.Label className={'email-label'}>Населенный пункт</Form.Label>
                            <Form.Control type="text" value={delivery} onChange={(e) => setDelivery(e.target.value)}/>
                        </Form.Group>
                        <div className={'delivery-variant-block'}>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="deliveryVariantRadio"
                                       id="flexRadioDefault1" value={'pickup'} checked={deliveryValue === 'pickup'}
                                       onChange={(e) => setDeliveryValue(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault1"></label>
                                <div className={'delivery-label-container'}>
                                    <div>
                                        Самовывоз
                                    </div>
                                    <div className={'radio-description'}>
                                        На пункте выдачи
                                    </div>
                                </div>
                                <div className={'delivery-price'}>
                                    + 0 ₽
                                </div>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="deliveryVariantRadio"
                                       id="flexRadioDefault2" value={'courier'} checked={deliveryValue === 'courier'}
                                       onChange={(e) => setDeliveryValue(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault2"></label>
                                <div className={'delivery-label-container'}>
                                    <div>Курьером</div>
                                    <div className={'radio-description'}>
                                        Доставка курьером
                                    </div>
                                </div>
                                <div className={'delivery-price'}>
                                    + 300 ₽
                                </div>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="deliveryVariantRadio"
                                       id="flexRadioDefault3" value={'point'} checked={deliveryValue === 'point'}
                                       onChange={(e) => setDeliveryValue(e.target.value)}/>
                                <label className="form-check-label" htmlFor="flexRadioDefault3"></label>
                                <div className={'delivery-label-container'}>
                                    <div>Доставка в точки самовывоза</div>
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
                        </div>
                        {deliveryValue === 'courier' &&
                            <Form.Group className="mb-3" controlId="formBasicAddress">
                                <label htmlFor="orderAddress">Адрес</label>
                                <textarea id={'orderAddress'} value={orderAddress}
                                          onChange={(e) => setOrderAddress(e.target.value)}></textarea>
                            </Form.Group>
                        }
                        <Form.Group className="mb-3" controlId="formBasicComment">
                            <label htmlFor="orderComment">Комментарии к заказу</label>
                            <textarea id={'orderComment'} value={orderComment}
                                      onChange={(e) => setOrderComment(e.target.value)}></textarea>
                        </Form.Group>
                        <Form.Group className="mb-3 order-subscription-group form-check" controlId="formBasicPermanent">
                            <Form.Check value={subscription} onChange={() => setSubscription(!subscription)}/>
                            <Form.Label className="form-check-label"></Form.Label>
                            <div className={'delivery-label-container'}>
                                <div>Подписаться на SMS рассылку</div>
                                <div className={'radio-description'}>
                                    Вы сможете получать сообщения и видеть скидки и акции на товары
                                </div>
                            </div>
                        </Form.Group>
                        <Button type={"submit"} variant={"success"}>Подтвердить</Button>
                    </Form>
                </div>
                <div className={'right-container'}>
                    {cards}
                    <h1>{allCost}</h1>
                </div>
            </Styled>
            <Modal
                show={showAlert}
                backdrop="static"
                keyboard={false}
            >
                <Alert show={showAlert} variant="success" style={{margin: 0}}>
                    <Alert.Heading>Заказ сформирован!</Alert.Heading>
                    <p>
                        Детали и статус заказа вы всегда можете посмотреть у себя в профиле.
                    </p>
                    <hr />
                    <div className="d-flex justify-content-end">
                        <Button onClick={() => {
                            setShowAlert(false);
                            navigate('/basket');
                        }} variant="outline-success">
                            Ок
                        </Button>
                    </div>
                </Alert>
            </Modal>
        </>
    );
});

export default Order;