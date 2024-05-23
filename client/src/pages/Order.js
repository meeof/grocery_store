import React, {useContext, useEffect, useState} from 'react';
import {authAPI} from "../http/userAPI";
import {Context} from "../index";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import OrderProductCard from "../components/OrderProductCard";
import {observer} from "mobx-react-lite";
import OrderForm from "../components/OrderForm";
import AlertOrdered from "../components/miniComponents/AlertOrdered";

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
  }
  .right-container {
    box-shadow: 2px 0 2px inset rgba(0, 0, 0, 0.1);
    padding-left: 20px;
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
                <div className={'left-container'}>
                    <h2>Оформление заказа</h2>
                    <OrderForm setShowAlert={setShowAlert} field={'page'}/>
                </div>
                <div className={'right-container'}>
                    {cards}
                    <h1>{allCost}</h1>
                </div>
            </Styled>
            <AlertOrdered field={'page'} showAlert={showAlert} setShowAlert={setShowAlert}/>
        </>
    );
});

export default Order;