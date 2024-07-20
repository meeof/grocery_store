import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import OrderCard from "../components/cards/OrderCard";
import {useNavigate} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import {Button} from "react-bootstrap";
import AlertClearHistory from "../components/alerts/AlertClearHistory";
import {
    breakpoints, customGrid2,
    flexColumn,
    marginsPage, standardValues
} from "../StyledGlobal";
import {authAPI} from "../api";
import Load from "../components/Load";
import useWindowSize from "../hooks/useWindowSize";

const Styled = styled.div`
  margin-top: ${standardValues.marginSmall};
  ${marginsPage};
  ${flexColumn};
  justify-content: center;
  position: relative;
  .buttons-block {
    padding-bottom: ${standardValues.marginSmall};
    padding-top: ${standardValues.marginSmall};
    display: flex;
    justify-content: center;
    .clear-orders {
      justify-self: flex-end;
      right: 0;
      position: ${(props) => props.$showMore ? 'absolute' : 'static'};
      margin-left: ${(props) => props.$showMore ? '0' : 'auto'};;
    }
    .show-more {
      width: ${standardValues.freeButtonWidth};
      display: ${(props) => props.$showMore ? '' : 'none'};
    }
  }
  .orders-block {
    ${customGrid2};
  }
  @media (${breakpoints.small}) {
    .orders-block {
      position: relative;
    }
    .clear-orders {
      position: fixed;
      width: 100%;
      bottom: ${standardValues.marginSmall};
      opacity: .7;
    }
    .buttons-block {
      ${flexColumn};
      .show-more {
        margin-bottom: ${standardValues.marginMedium};
        width: 100%;
      }
    }
  }
`;

const Orders = observer(() => {
    const width = useWindowSize();
    const theme = useTheme();
    const months = ['Января' , 'Февраля' , 'Марта' , 'Апреля' , 'Мая' , 'Июня' , 'Июля' , 'Августа' , 'Сентября' , 'Октября' , 'Ноября' , 'Декабря'];
    const navigate = useNavigate();
    const {basket, scroll} = useContext(Context);
    const [showAlert, setShowAlert] = useState(false);
    const [fixedWidth, setFixedWidth] = useState('100%');
    const intersectionObserver = useRef(null);
    const intersectionObservable = useRef(null);
    const fetchOrders = useCallback((limit) => {
        authAPI( 'get', '/api/basket/orders', {limit})
            .then(data => {
                if (data === 'Unauthorized') {
                    navigate('/profile/login')
                    return
                }
                basket.setOrders(data.rows);
                basket.setOrdersCount(data.count);
            }).catch(err => {
                console.log(err);
                navigate('/profile/login')
        }).finally(() => {
            width > breakpoints.rawFromSmall && scroll.scrollToPoint();
        })
    }, [basket, navigate, scroll, width]);
    const clearOrdersHandler = () => {
        authAPI('delete', '/api/basket/clearOrders').then((data) => {
            if (data === 'Unauthorized') {
                return
            }
            setShowAlert(false);
            fetchOrders(basket.ordersLimit);
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        fetchOrders(basket.ordersLimit);
    }, [basket, fetchOrders]);
    useEffect(() => {
        setTimeout(() => {
            setFixedWidth((width - standardValues.smallPageMargin *
                2 - (window.innerWidth - document.body.clientWidth) + 'px'));
        }, 0)
        if (intersectionObservable.current && width < breakpoints.rawSmall) {
            intersectionObserver.current && intersectionObserver.current.disconnect();
            const callback = function (entries, observer) {
                if (entries[0].isIntersecting && basket.ordersCount > basket.ordersLimit && basket.ordersLimit === basket.getOrders.length) {
                    basket.setOrdersLimit(basket.ordersLimit * 2);
                    fetchOrders(basket.ordersLimit);
                }
            };
            intersectionObserver.current = new IntersectionObserver(callback);
            intersectionObserver.current.observe(intersectionObservable.current);
        }
    });
    const clearOrdersButton = <Button  className={'clear-orders'} variant={"secondary"} disabled={basket.getOrders?.length === 0}
                                        onClick={() => setShowAlert(true)}
                                       style={{width : (width < breakpoints.rawSmall) ? fixedWidth : ''}}>Очистить историю</Button>
    return (
        <>
            {basket.getOrders ? <Styled $showMore={basket.ordersCount > basket.ordersLimit}>
                <>
                    {basket.getOrders.length === 0 ? <div style={{marginLeft: 'auto', marginRight: 'auto'}}>Ничего нет</div> :
                        <div className={'orders-block'}>
                            {basket.getOrders.map(order => {
                                return <OrderCard order={order} months={months} key={order.id}/>
                            })}
                            {width < breakpoints.rawSmall && clearOrdersButton}
                    </div>}
                </>
                <div ref={intersectionObservable} className={'buttons-block'}>
                    {width > breakpoints.rawFromSmall && <>
                        <Button variant={theme.colors.bootstrapMainVariant} className={'show-more'}  onClick={() => {
                            scroll.setScroll()
                            basket.setOrdersLimit(basket.ordersLimit * 2);
                            basket.setOrders(0);
                            fetchOrders(basket.ordersLimit);
                        }}>Показывать больше</Button>
                        {clearOrdersButton}
                    </>}
                </div>
                <AlertClearHistory showAlert={showAlert} setShowAlert={setShowAlert}
                                   clearOrdersHandler={clearOrdersHandler}/>
            </Styled> : <Load/>}
        </>
    );
});

export default Orders;