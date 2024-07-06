import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import OrderItemCard from "../components/cards/OrderItemCard";
import {observer} from "mobx-react-lite";
import OrderForm from "../components/OrderForm";
import AlertOrdered from "../components/alerts/AlertOrdered";
import {breakpoints, marginsPage, standardValues} from "../StyledGlobal";
import Load from "../components/Load";

const Styled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  ${marginsPage};
  .order-left {
    padding-right: ${standardValues.marginMedium};
  }
  .order-right {
    box-shadow: 2px 0 2px inset rgba(0, 0, 0, 0.1);
    padding-left: ${standardValues.marginMedium};
    .order-cost {
      box-shadow: 0 2px 2px  rgba(0, 0, 0, 0.1), 0 2px 2px inset rgba(0, 0, 0, 0.1);
      display: flex;
      justify-content: space-between;
    }
  }
  @media (${breakpoints.small}) {
    display: flex;
    flex-direction: column-reverse;
    .order-left, .order-right {
      padding: 0;
      box-shadow: none;
    }
  }
`;

const Order = observer( () => {
    const navigate = useNavigate();
    const {basket} = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);
    const [deliveryCost, setDeliveryCost] = useState(0);
    useEffect(() => {
        basket.fetchBasket(navigate)
    }, [navigate, basket]);
    return (
        <>
            {
                basket.getBasket ? <>
                    <Styled>
                        <div className={'order-left'}>
                            <h2>Оформление заказа</h2>
                            <OrderForm setShowAlert={setShowAlert} field={'page'} setDeliveryCost={setDeliveryCost}/>
                        </div>
                        <div className={'order-right'}>
                            {basket.getBasket.map(product => {
                                return <OrderItemCard key={product.itemId} product={product}/>
                            })}
                            <div className={'order-cost'}>
                                <h1>Итого:</h1>
                                <h1>{basket.allCost + deliveryCost} ₽</h1>
                            </div>
                        </div>
                    </Styled>
                    <AlertOrdered field={'page'} showAlert={showAlert} setShowAlert={setShowAlert}/>
                </> : <Load/>
            }
        </>
    );
});

export default Order;