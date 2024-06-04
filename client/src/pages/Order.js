import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import OrderProductCard from "../components/cards/OrderProductCard";
import {observer} from "mobx-react-lite";
import OrderForm from "../components/OrderForm";
import AlertOrdered from "../components/alerts/AlertOrdered";
import {marginMedium, marginsPage} from "../StyledGlobal";
import Load from "../components/Load";

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
      box-shadow: 0 2px 2px  rgba(0, 0, 0, 0.1), 0 2px 2px inset rgba(0, 0, 0, 0.1);
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
        user.checkAuthUser(() => {basket.fetchBasket(user.isAuth.id)}, navigate)
    }, [navigate, user, basket]);
    return (
        <>
            {
                basket.getBasket ? <>
                    <Styled>
                        <div className={'order-left'}>
                            <h2>Оформление заказа</h2>
                            <OrderForm setShowAlert={setShowAlert} field={'page'}/>
                        </div>
                        <div className={'order-right'}>
                            {basket.getBasket.map(product => {
                                return <OrderProductCard key={product.itemId} product={product}/>
                            })}
                            <div className={'order-cost'}>
                                <h1>Итого:</h1>
                                <h1>{basket.allCost} ₽</h1>
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