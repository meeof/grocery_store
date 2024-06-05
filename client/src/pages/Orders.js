import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import OrderCard from "../components/cards/OrderCard";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Button} from "react-bootstrap";
import AlertClearHistory from "../components/alerts/AlertClearHistory";
import {
    breakpoints, colors, customGrid2,
    flexColumn,
    freeButtonWidth,
    marginMedium,
    marginSmall,
    marginsPage
} from "../StyledGlobal";
import {authAPI} from "../api";
import Load from "../components/Load";

const Styled = styled.div`
  margin-top: ${marginSmall};
  ${marginsPage};
  ${flexColumn};
  justify-content: center;
  position: relative;
  .buttons-block {
    padding-bottom: ${marginSmall};
    padding-top: ${marginSmall};
    display: flex;
    justify-content: center;
    .clear-orders {
      justify-self: flex-end;
      right: 0;
      position: ${(props) => props.$showMore ? 'absolute' : 'static'};
      margin-left: ${(props) => props.$showMore ? '0' : 'auto'};;
    }
    .show-more {
      width: ${freeButtonWidth};
      display: ${(props) => props.$showMore ? '' : 'none'};
    }
  }
  .orders-block {
    ${customGrid2};
  }
  @media (${breakpoints.small}) {
    .buttons-block {
      ${flexColumn};
      .clear-orders {
        position: static;
        width: 100%;
      }
      .show-more {
        margin-bottom: ${marginMedium};
        width: 100%;
      }
    }
  }
`;

const Orders = observer(() => {
    const months = ['Января' , 'Февраля' , 'Марта' , 'Апреля' , 'Мая' , 'Июня' , 'Июля' , 'Августа' , 'Сентября' , 'Октября' , 'Ноября' , 'Декабря'];
    const navigate = useNavigate();
    const {user, basket} = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);
    const fetchOrders = useCallback((userId, limit) => {
        authAPI( 'get', '/api/basket/orders', {userId, limit})
            .then(data => {
                basket.setOrders(data.rows);
                basket.setOrdersCount(data.count);
            }).catch(err => {
            console.log(err);
        })
    }, [basket]);
    useEffect(() => {
        user.checkAuthUser(() => fetchOrders(user.isAuth.id, basket.ordersLimit), navigate)
    }, [basket, navigate, user, fetchOrders]);
    const clearOrdersHandler = () => {
        authAPI('delete', '/api/basket/clearOrders', {userId: user.isAuth.id}).then(data => {
            if (data === 'success') {
                setShowAlert(false);
                fetchOrders(user.isAuth.id, basket.ordersLimit);
            }
        }).catch(err => {
            console.log(err);
        })
    }
    return (
        <>
            {basket.getOrders ? <Styled $showMore={basket.ordersCount > basket.ordersLimit}>
                <>
                    {basket.getOrders.length === 0 ? <div style={{marginLeft: 'auto', marginRight: 'auto'}}>Ничего нет</div> :
                        <div className={'orders-block'}>
                            {basket.getOrders.map(order => {
                                return <OrderCard order={order} months={months} key={order.id}/>
                            })}
                    </div>}
                </>
                <div className={'buttons-block'}>
                    <Button variant={colors.bootstrapMainVariant} className={'show-more'}  onClick={() => {
                        basket.setOrdersLimit(basket.ordersLimit * 2);
                        basket.setOrders(0);
                        fetchOrders(user.isAuth.id, basket.ordersLimit);
                    }}>Показывать больше</Button>
                    <Button className={'clear-orders'} variant={"secondary"} disabled={basket.getOrders.length === 0}
                            onClick={() => setShowAlert(true)}>Очистить историю</Button>
                </div>
                <AlertClearHistory showAlert={showAlert} setShowAlert={setShowAlert}
                                   clearOrdersHandler={clearOrdersHandler}/>
            </Styled> : <Load/>}
        </>
    );
});

export default Orders;