import React, {useState} from 'react';
import styled from "styled-components";
import {Accordion, Button, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import noImage from "../../assets/icon_no_image.svg";
import {useNavigate} from "react-router-dom";
import Rating from "../Rating";
import SetProductRatingCard from "./SetProductRatingCard";
import {breakpoints, colors, flexColumn, marginMedium, marginSmall} from "../../StyledGlobal";
const Styled = styled.div`
  ${flexColumn};
  border-radius: 5px;
  border: solid ${colors.lightColor} 1px;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
  background-color: ${colors.extraLightColor};
  @media (${breakpoints.large}) {
    margin-bottom: ${marginMedium};
  }
  .order-card-head {
    display: flex;
    align-items: flex-start;
    i {
      color: ${colors.main};
    }
  }
  .order-important {
    border-radius: 5px;
    border: solid ${colors.main} 2px;
    color: ${colors.main};
    width: min-content;
    white-space: nowrap;
    padding: 5px;
    font-weight: bold;
    margin-left: auto;
    display: flex;
    justify-content: center;
  }
  .orders-grade-block {
    display: flex;
    justify-content: space-between;
    >button {
      width: 48%;
    }
  }
  .accordion-body {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
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
        background-color: ${colors.mainOpacity};
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
    margin: ${marginSmall} 0;
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
                <b>Доставка {deliveryRUS[order.delivery]} {order.point && <i> - {order.point}</i>}</b>
                <div>{order.address}</div>
                <div>Дата доставки: {dataDelivery.getDate()} {months[dataDelivery.getMonth()]}</div>
                {order.comment && <div className={'comm-block'}>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Комментарий</Accordion.Header>
                            <Accordion.Body>
                                {order.comment}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>}
                <div className={'orders-grade-block'}>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => setShowModalAll(true)}>Оценить заказ</Button>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => setShowModalOne(true)}>Оценить товар</Button>
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
                <Modal.Header closeButton style={{backgroundColor: colors.mainOpacity}}>
                    <Modal.Title style={{whiteSpace: "nowrap"}}>
                        Общая оценка для всех товаров заказа
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Rating big={true} itemsId={JSON.parse(order.items).map(item => item.itemId)}/>
                </Modal.Body>
            </Modal>
            <Modal
                show={showModalOne}
                onHide={() => setShowModalOne(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton style={{backgroundColor: colors.mainOpacity}}>
                    <Modal.Title>
                        Оценка товаров
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {JSON.parse(order.items).map(item => {
                        return <SetProductRatingCard key={item.itemId} item={item}/>
                    })}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default OrderCard;