import React, {useContext, useEffect, useState} from 'react';
import {getOrders} from "../http/basketAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import OrderCard from "../components/OrderCard";
import {authAPI} from "../http/userAPI";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import {Button} from "react-bootstrap";

const Styled = styled.div`
  margin: 8px 24px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  > button {
    width: 30%;
    margin: 20px auto 0 auto;
  }
  .orders-block {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 50px;
  }
  @media (max-width: 575.5px) {
    margin: 8px;
    .orders-block {
      display: flex;
      flex-direction: column;
    }
  }
  @media (min-width: 576px) and (max-width: 991.5px) {
    .orders-block {
      grid-template-columns: 1fr 1fr;
    }
  }
`;

const MyOrders = observer(() => {
    const months = ['Января' , 'Февраля' , 'Марта' , 'Апреля' , 'Мая' , 'Июня' , 'Июля' , 'Августа' , 'Сентября' , 'Октября' , 'Ноября' , 'Декабря'];
    const navigate = useNavigate();
    const {user, basket} = useContext(Context);
    const [limit, setLimit] = useState(6);
    const orders = basket.getOrders.map(order => {
        return <OrderCard order={order} months={months} key={order.id}/>
    })
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    useEffect(() => {
        if (user.isAuth) {
            getOrders(user.isAuth.id, limit).then(data => {
                basket.setOrders(data);
            }).catch(err => {
                console.log(err);
            })
        }
    }, [user.isAuth, basket, limit]);
    return (
        <Styled>
            <div className={'orders-block'}>
                {orders}
            </div>
            <Button variant={"success"} onClick={() => setLimit(limit + 6)}>Показывать больше</Button>
        </Styled>
    );
});

export default MyOrders;