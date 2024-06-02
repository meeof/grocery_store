import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import OrderCard from "../components/cards/OrderCard";
import {authorization} from "../api";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Button} from "react-bootstrap";
import AlertClearHistory from "../components/alerts/AlertClearHistory";
import {
    breakpoints, colors, customGrid2,
    flexColumn,
    freeButtonWidth,
    marginMedium,
    marginsCenter,
    marginSmall,
    marginsPage
} from "../StyledGlobal";
import {authAPI} from "../api";

const Styled = styled.div`
  margin-top: ${marginSmall};
  ${marginsPage};
  ${flexColumn};
  justify-content: center;
  position: relative;
  .clear-orders {
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .show-more {
    width: ${freeButtonWidth};
    margin-top: ${marginMedium};
    ${marginsCenter};
  }
  .orders-block {
    ${customGrid2};
  }
  @media (${breakpoints.small}) {
    .show-more {
      width: 100%;
    }
    .clear-orders {
      position: static;
      margin-top: ${marginSmall};
      width: 100%;
    }
  }
`;

const Orders = observer(() => {
    const months = ['Января' , 'Февраля' , 'Марта' , 'Апреля' , 'Мая' , 'Июня' , 'Июля' , 'Августа' , 'Сентября' , 'Октября' , 'Ноября' , 'Декабря'];
    const navigate = useNavigate();
    const {user, basket} = useContext(Context);
    const [limit, setLimit] = useState(6);
    const [showAlert, setShowAlert] = useState(false);
    const orders = basket.getOrders.map(order => {
        return <OrderCard order={order} months={months} key={order.id}/>
    })
    useEffect(() => {
        authorization().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    useEffect(() => {
        if (user.isAuth) {
            authAPI( 'get', '/api/basket/orders', {userId: user.isAuth.id, limit}).then(data => {
                basket.setOrders(data);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [user.isAuth, basket, limit]);
    const clearOrdersHandler = () => {
        authAPI('delete', '/api/basket/clearOrders', {userId: user.isAuth.id}).then(data => {
            if (data === 'success') {
                setShowAlert(false);
                authAPI('get', '/api/basket/orders', {userId: user.isAuth.id, limit}).then(data => {
                    basket.setOrders(data);
                }).catch(err => {
                    console.log(err);
                })
            }
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <Styled>
            <div className={'orders-block'}>
                {orders}
            </div>
            <Button variant={colors.bootstrapMainVariant} className={'show-more'} onClick={() => setLimit(limit + 6)}>Показывать больше</Button>
            <Button className={'clear-orders'} variant={"secondary"} disabled={orders.length === 0}
                    onClick={() => setShowAlert(true)}>Очистить историю</Button>
            <AlertClearHistory showAlert={showAlert} setShowAlert={setShowAlert} clearOrdersHandler={clearOrdersHandler}/>
        </Styled>
    );
});

export default Orders;