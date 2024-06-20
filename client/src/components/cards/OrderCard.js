import React, {useContext, useState} from 'react';
import styled, {useTheme} from "styled-components";
import {Accordion, Button, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import noImage from "../../assets/light/icon_no_image.svg";
import {useNavigate} from "react-router-dom";
import Rating from "../Rating";
import SetItemRatingCard from "./SetItemRatingCard";
import {breakpoints, staticColors, flexColumn, standardValues, Theme} from "../../StyledGlobal";
import * as uf from "../../usefulFunctions";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
const Styled = styled.div`
  ${flexColumn};
  border-radius: 5px;
  border: solid ${staticColors.lightColor} 1px;
  padding: 10px;
  width: 100%;
  justify-content: space-between;
  background-color: ${staticColors.extraLightColor};
  @media (${breakpoints.large}) {
    margin-bottom: ${standardValues.marginMedium};
  }
  .order-card-head {
    display: flex;
    align-items: flex-start;
    i {
      color: ${({theme}) => theme.colors.main};
    }
  }
  .order-important {
    border-radius: 5px;
    border: solid ${({theme}) => theme.colors.main} 2px;
    color: ${({theme}) => theme.colors.main};
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
        background-color: ${({theme}) => theme.colors.mainOpacity};
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
    margin: ${standardValues.marginSmall} 0;
  }
`

const OrderCard = observer(({order, months}) => {
    const navigate = useNavigate();
    const {review, item} = useContext(Context);
    const theme = useTheme();
    const [showModalAll, setShowModalAll] = useState(false);
    const [showModalOne, setShowModalOne] = useState(false);
    const dataCreate = new Date(order.createdAt);
    const dataDelivery = new Date(order.delivery_date);
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
    const images = JSON.parse(order.items).map(itemObj => {
        return <div className={'img-item'} key={itemObj.itemId}>
            <OverlayTrigger
                placement="right"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip({name:itemObj.name})}
            >
                <img alt={''} src={itemObj.img ? process.env.REACT_APP_API_URL + itemObj.img : noImage} onClick={() => {
                    navigate(uf.routePrefix(`/catalog/category_${itemObj.categoryId}/product`, itemObj.itemId));
                    item.setOneItem(null);
                    review.setReviews(null);
                }}/>
            </OverlayTrigger>
            <div className={'img-item-label'}>{itemObj.cost} ₽ x {itemObj.amount} шт.</div>
        </div>
    });
    return (
        <>
            <Styled $themeDark={Theme.dark}>
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
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={() => setShowModalAll(true)}>Оценить заказ</Button>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={() => setShowModalOne(true)}>Оценить товар</Button>
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
                <Modal.Header closeButton style={{backgroundColor: theme.colors.mainOpacity}}>
                    <Modal.Title style={{whiteSpace: "nowrap"}}>
                        Общая оценка для всех товаров заказа
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Rating setShowModalAll={setShowModalAll} itemsId={JSON.parse(order.items).map(item => item.itemId)}/>
                </Modal.Body>
            </Modal>
            <Modal
                show={showModalOne}
                onHide={() => setShowModalOne(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton style={{backgroundColor: theme.colors.mainOpacity}}>
                    <Modal.Title>
                        Оценка товаров
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {JSON.parse(order.items).map(item => {
                        return <SetItemRatingCard key={item.itemId} item={item}/>
                    })}
                </Modal.Body>
            </Modal>
        </>
    );
});

export default OrderCard;