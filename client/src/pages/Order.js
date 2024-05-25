import React, {useContext, useEffect, useState} from 'react';
import {authAPI} from "../api/userAPI";
import {Context} from "../index";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import OrderProductCard from "../components/cards/OrderProductCard";
import {observer} from "mobx-react-lite";
import OrderForm from "../components/orders/OrderForm";
import AlertOrdered from "../components/alerts/AlertOrdered";
import {marginMedium, marginsPage} from "../StyledGlobal";

const Styled = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  ${marginsPage};
  .order-left {
    padding-right: ${marginMedium};
  }
  .order-right {
    box-shadow: 2px 0 2px inset rgba(0, 0, 0, 0.1);
    padding-left: ${marginMedium};
    .order-cost {
      display: flex;
      justify-content: space-between;
    }
  }
`;

const Order = observer( () => {
    const navigate = useNavigate();
    const {user, basket} = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    let allCost = 0;
    const cards = basket.getBasket.map(product => {
        allCost += product.cost * product.amount;
        return <OrderProductCard key={product.itemId} product={product}/>
    });
    return (
        <>
            <Styled>
                <div className={'order-left'}>
                    <h2>Оформление заказа</h2>
                    <OrderForm setShowAlert={setShowAlert} field={'page'}/>
                </div>
                <div className={'order-right'}>
                    {cards}
                    <div className={'order-cost'}>
                        <h1>Итого:</h1>
                        <h1>{allCost} ₽</h1>
                    </div>
                </div>
            </Styled>
            <AlertOrdered field={'page'} showAlert={showAlert} setShowAlert={setShowAlert}/>
        </>
    );
});

export default Order;