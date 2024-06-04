import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {authorization} from "../api";
import styled from "styled-components";
import BasketProductCard from "../components/cards/BasketProductCard";
import {Form} from "react-bootstrap";
import {breakpoints, colors, flexColumn, largeButton, marginMedium, marginSmall, marginsPage} from "../StyledGlobal";
import {authAPI} from "../api";
import Load from "../components/Load";
import BasketCost from "../components/cards/BasketCost";

const Styled = styled.div`
  ${marginsPage};
  display: grid;
  grid-template-columns: 5fr 2fr;
  .card-block {
    position: relative;
  }
  .basket-other {
    ${flexColumn}
    button {
      font-size: large;
      ${largeButton};
      margin-bottom: 0;
      margin-top: auto;
    }
    .other-block {
      ${flexColumn};
      padding: 15px;
      width: 100%;
      background-color: ${colors.extraLightColor};
      border: 1px transparent solid;
      border-radius: 5px;
      height: 160px;
    }
    .other-cost {
      font-size: x-large;
      font-weight: bold;
      line-height: 1.2;
    }
    .other-promo {
      margin-bottom: 10px;
      .link-promo {
        color: ${colors.main};
        margin-top: auto;
        align-self: flex-end;
        text-decoration: underline;
      }
      .form-control {
        margin-top: ${marginSmall}
      }
    }
    @media (${breakpoints.fromSmall}) {
      margin-left: ${marginMedium};
    }
  }
  @media (${breakpoints.small}) {
    ${flexColumn}
  }
`;

const Basket = observer(() => {
    const {user, basket} = useContext(Context);
    const navigate = useNavigate();
    const deleteBasketItemHandle = (userId, itemId) => {
        if (user.isAuth) {
            authAPI( 'delete', '/api/basket', {userId, itemId}).then(() => {
                basket.fetchBasket(user.isAuth.id);
            }).catch(err => {
                console.log(err)
            })
        }
    }
    useEffect(() => {
        if (!basket.getBasket) {
            if (!user.isAuth) {
                authorization().then(data => {
                    user.setAuth(data);
                    basket.fetchBasket(user.isAuth.id);
                }).catch(() => {
                    user.setAuth(false);
                    navigate(`/profile/login`);
                })
            }
            else {
                basket.fetchBasket(user.isAuth.id)
            }
        }
    }, [navigate, basket, user]);
    return (
        <Styled>
            <div className={'card-block'}>
                {
                    basket.getBasket ? <>{basket.getBasket.length !== 0 ?
                                basket.getBasket.map(product => {
                                    return <BasketProductCard key={product.itemId} product={product}
                                                               deleteBasketItemHandle={deleteBasketItemHandle}/>
                                }) :
                                <h2>Корзина пуста</h2>}</> :
                        <Load/>
                }
            </div>
            <div className={'basket-other'}>
                <div className={'other-block other-promo'}>
                    <b>Введите промокод</b>
                    <Form.Control placeholder={'Промокод'}/>
                    <div role={"button"} className={'link-promo'}>Активировать</div>
                </div>
                <BasketCost/>
            </div>
        </Styled>
    );
});

export default Basket;