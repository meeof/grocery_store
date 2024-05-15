import React, {useState} from 'react';
import styled from "styled-components";
import {Accordion, Button, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import noImage from "../assets/free-icon-font-copy-image-9291618.svg";
import {useNavigate} from "react-router-dom";
import Rating from "./miniComponents/Rating";
import SetProductRatingCard from "./SetProductRatingCard";
const Styled = styled.div`
  border-radius: 5px;
  border: solid lightgray 1px;
  padding: 10px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #f8f9fa;
  @media (max-width: 575.5px) {
    margin-bottom: 20px;
  }
  .order-card-head {
    display: flex;
    align-items: flex-start;
    i {
      color: #198754;
    }
  }
  .order-important {
    border-radius: 5px;
    border: solid #198754 2px;
    color: #198754;
    width: min-content;
    white-space: nowrap;
    padding: 5px;
    font-weight: bold;
    margin-left: auto;
    display: flex;
    justify-content: center;
    > h2 {
      width: 100%;
    }
  }
  .orders-grade-block {
    display: flex;
    justify-content: space-between;
    >button {
      width: 48%;
    }
  }
  > button {
    width: 100%;
  }
  .accordion-body {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
  }
  .accordion {
    width: 100%;
  }
  .img-block {
    .img-item {
      position: relative;
      padding: 5px;
      img {
        height: 5rem;
        cursor: pointer;
      }
      .img-item-label {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: rgba(25,135,84, 0.5);
        color: black;
        border: solid transparent 1px;
        border-radius: 5px;
        line-height: 1;
        font-size: 0.7rem;
      }
    }
  }
  > {
    &:last-child {
      width: 100%;
    }
  }
  .comm-block, .img-block {
    margin: 10px 0;
  }
`

const OrderCard = ({order, months}) => {
    const [showModalAll, setShowModalAll] = useState(false);
    const [showModalOne, setShowModalOne] = useState(false);
    const dataCreate = new Date(order.createdAt);
    const dataDelivery = new Date(order.delivery_date);
    const navigate = useNavigate();
    const deliveryRUS = {
        'courier': 'курьером',
        'point': 'в точку самовывоза',
        'pickup': 'в пункт выдачи'
    };
    const renderTooltip = (props) => {
        return <Tooltip id="button-tooltip" {...props}>
            {props.name}
        </Tooltip>
    };
    const images = JSON.parse(order.items).map(item => {
        return <div className={'img-item'} key={item.itemId}>
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip({name:item.name})}
            >
                <img alt={''} src={item.img ? process.env.REACT_APP_API_URL + item.img : noImage} onClick={() => {
                    navigate(`/catalog/all/product_${item.itemId}`)
                }}/>
            </OverlayTrigger>
            <div className={'img-item-label'}>{item.cost} ₽ x {item.amount} шт.</div>
        </div>
    });
    return (
        <>
            <Styled>
                <div className={'order-card-head'}>
                    <div>
                        <b>Заказ от {dataCreate.getDate()} {months[dataCreate.getMonth()]}</b>
                        <i>  id: {order.id}</i>
                    </div>
                    <div className={'order-important'}>
                        {order.status}
                    </div>
                </div>
                <b>Доставка {deliveryRUS[order.delivery]} ({order.point})</b>
                <div>Дата доставки: {dataDelivery.getDate()} {months[dataDelivery.getMonth()]}</div>
                <div className={'comm-block'}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Комментарий</Accordion.Header>
                            <Accordion.Body>
                                {order.comment}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <div className={'orders-grade-block'}>
                    <Button variant={"success"} onClick={() => setShowModalAll(true)}>Оценить заказ</Button>
                    <Button variant={"success"} onClick={() => setShowModalOne(true)}>Оценить товар</Button>
                </div>
                <div className={'img-block'}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Товары</Accordion.Header>
                            <Accordion.Body>
                                {images}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
                <div className={'order-important'}>
                    Стоимость: {order.full_price} ₽
                </div>
            </Styled>
            <Modal
                show={showModalAll}
                onHide={() => setShowModalAll(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton style={{backgroundColor: 'rgba(25,135,84, 0.5)'}}>
                    <Modal.Title>
                        Общая оценка для всех товаров заказа
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Rating big={true}/>
                </Modal.Body>
            </Modal>
            <Modal
                show={showModalOne}
                onHide={() => setShowModalOne(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton style={{backgroundColor: 'rgba(25,135,84, 0.5)'}}>
                    <Modal.Title>
                        Оценка товаров
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {JSON.parse(order.items).map(item => {
                        return <SetProductRatingCard item={item}/>
                    })}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderCard;