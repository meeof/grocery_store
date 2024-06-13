import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";
import BasketItemCard from "../components/cards/BasketItemCard";
import {breakpoints, flexColumn, marginsPage} from "../StyledGlobal";
import {authAPI} from "../api";
import Load from "../components/Load";
import BasketOther from "../components/cards/BasketOther";

const Styled = styled.div`
  ${marginsPage};
  display: grid;
  grid-template-columns: 5fr 2fr;
  .card-block {
    position: relative;
  }
  @media (${breakpoints.small}) {
    ${flexColumn}
  }
`;

const Basket = observer(() => {
    const {user, basket} = useContext(Context);
    const navigate = useNavigate();
    const deleteBasketItemHandle = (itemId) => {
        if (user.isAuth) {
            authAPI( 'delete', '/api/basket', {itemId}).then(() => {
                basket.fetchBasket(user.isAuth.id);
            }).catch(err => {
                console.log(err);
                navigate('/profile/login');
            })
        }
    }
    useEffect(() => {
        if (!basket.getBasket) {
            basket.fetchBasket(navigate);
        }
    }, [navigate, basket]);
    return (
        <Styled>
            <div className={'card-block'}>
                {
                    basket.getBasket ? <>{basket.getBasket.length !== 0 ?
                                basket.getBasket.map(product => {
                                    return <BasketItemCard key={product.itemId} product={product}
                                                           deleteBasketItemHandle={deleteBasketItemHandle}/>
                                }) :
                                <h2>Корзина пуста</h2>}</> :
                        <Load/>
                }
            </div>
            <BasketOther/>
        </Styled>
    );
});

export default Basket;