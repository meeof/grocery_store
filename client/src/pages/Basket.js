import React, {useContext, useEffect, useState} from 'react';
import {deleteBasketItem, getAllBasketItems} from "../http/basketAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {authAPI} from "../http/userAPI";
import styled from "styled-components";
import BasketProductCard from "../components/BasketProductCard";
import AllCostPromoBlock from "../components/miniComponents/AllCostPromoBlock";

const Styled = styled.div`
  margin: 8px 24px;
  flex-direction: column;
  display: grid;
  grid-template-columns: 5fr 2fr;
  @media (max-width: 575.5px) {
    margin: 8px;
    display: flex;
    flex-direction: column;
  }
`;

const Basket = observer(() => {
    const {user, basket} = useContext(Context);
    const navigate = useNavigate();
    const [allCost, setAllCost] = useState(0);
    const deleteBasketItemHandle = (userId, itemId) => {
        if (user.isAuth) {
            deleteBasketItem(userId, itemId).then(data => {
                getAllBasketItems(user.isAuth.id).then(data => {
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
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    useEffect(() => {
        if (user.isAuth) {
            getAllBasketItems(user.isAuth.id).then(data => {
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
            <AllCostPromoBlock allCost={allCost} active={cards.length === 0}/>
        </Styled>
    );
});

export default Basket;