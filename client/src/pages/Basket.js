import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {authorization} from "../api";
import styled from "styled-components";
import BasketProductCard from "../components/cards/BasketProductCard";
import {Button, Form} from "react-bootstrap";
import {breakpoints, colors, flexColumn, largeButton, marginMedium, marginSmall, marginsPage} from "../StyledGlobal";
import {authAPI} from "../api";

const Styled = styled.div`
  ${marginsPage};
  display: grid;
  grid-template-columns: 5fr 2fr;
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
    .other-cost {
      font-size: x-large;
      font-weight: bold;
      line-height: 1.2;
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
    const [allCost, setAllCost] = useState(0);
    const deleteBasketItemHandle = (userId, itemId) => {
        if (user.isAuth) {
            authAPI( 'delete', '/api/basket', {userId, itemId}).then(data => {
                authAPI('get', '/api/basket', {userId: user.isAuth.id}).then(data => {
                    basket.setBasket(data);
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err)
            })
        }
    }
    const cards = basket.getBasket.map(product => {
        return <BasketProductCard key={product.itemId} product={product} allCost={allCost}
                                  setAllCost={setAllCost} deleteBasketItemHandle={deleteBasketItemHandle}/>
    });
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
            authAPI('get', '/api/basket', {userId: user.isAuth.id}).then(data => {
                basket.setBasket(data);
            }).catch(err => {
                console.log(err);
            });
        }
    }, [user.isAuth, basket]);
    useEffect(() => {
        const sumCostAmount = basket.getBasket.reduce(
            (accumulator, product) => accumulator + product.cost * product.amount,
            0,
        );
        setAllCost(sumCostAmount);
    }, [basket.getBasket]);
    return (
        <Styled>
            <div className={'card-block'}>
                {cards.length !== 0 ? cards : <h2>Корзина пуста</h2>}
            </div>
            <div className={'basket-other'}>
                <div className={'other-block other-promo'}>
                    <b>Введите промокод</b>
                    <Form.Control placeholder={'Промокод'}/>
                    <div role={"button"} className={'link-promo'}>Активировать</div>
                </div>
                <div className={'other-block'}>
                    <div className={'other-cost'}>Итого к оплате:</div>
                    <div className={'other-cost'}>{allCost} ₽</div>
                    <Button variant={colors.bootstrapMainVariant} disabled={cards.length === 0} onClick={() => navigate('order')}>Оформить заказ</Button>
                </div>
            </div>
        </Styled>
    );
});

export default Basket;