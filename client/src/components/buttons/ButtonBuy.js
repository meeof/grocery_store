import React, {useContext, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import cartImg from '../../assets/icon_basket.svg';
import styled from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import useGetScrollBar from "../../hooks/useGetScrollBar";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {colors} from "../../StyledGlobal";
import {authAPI} from "../../api";
const Styled = styled.div`
  position: ${props => (props.$fixed && 'fixed')};
  bottom:  ${props => (props.$fixed && '14px')};
  left: ${props => (props.$fixed && '8px')};
  width: ${props => (props.$fixed ? props.$width - ((props.$scroll > 0 ? props.$scroll : 0) + 16) + 'px' : '100%')};
  z-index: 99;
  button {
    width: 100%;
    height: ${props => (props.$basket && '30px')};
    display: flex;
    align-items: center;
    justify-content: center;
  }
  img {
    margin-left: 4px;
    width: 16px;
    height: 16px;
  } 
  .buy-start {
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    > {
      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .to-basket {
      padding: 0;
      flex-direction: column;
      justify-content: space-evenly;
      border-radius: 0;
      cursor: ${props => (props.$basket && 'default')};;
      border-left-color: ${props => (!props.$basket && 'white')};
      border-right-color: ${props => (!props.$basket && 'white')};
      p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 0.8;
      }
    }
  }
`
const ButtonBuy = observer( ({productId, cost, basket, fixed,  allCost, setAllCost,
                                 allProductCost, setAllProductCost}) => {
    const navigate = useNavigate();
    const [productAmount, setProductAmount] = useState(0);
    const {user} = useContext(Context);
    let width = useWindowSize();
    let scrollBar = useGetScrollBar();
    const outherCostsHandler = (cost, operator) => {
        if (allCost && setAllCost) {
            setAllCost(allCost + (operator * cost));
        }
        if (allProductCost && setAllProductCost) {
            setAllProductCost(allProductCost + (operator * cost));
        }
    }
    function handleBuy(userId, itemId, amount) {
        authAPI( 'post', '/api/basket', {userId, itemId, amount}).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        authAPI('get', '/api/basket/one', {userId: user.isAuth.id, itemId: productId}).then(data => {
            if (data) {
                setProductAmount(data);
            }
        }).catch(err => {
            console.log(err);
        })
    }, [productId, user.isAuth.id]);
    return (
        <Styled $fixed={fixed} $width={width} $scroll={scrollBar} $basket={basket} onClick={e => e.stopPropagation()}>
            {productAmount > 0 ?
                <div className={'buy-start'}>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => {
                        if (basket && productAmount <= 1) {
                            return
                        }
                        outherCostsHandler(cost, -1);
                        setProductAmount(productAmount - 1);
                        handleBuy(user.isAuth.id, productId, productAmount - 1);
                    }}><b>-</b></Button>
                    <Button variant={colors.bootstrapMainVariant} className={'to-basket'}
                            onClick={() => navigate('/basket')}>
                        {basket ? <b>{productAmount}</b> : <>
                            <p>В корзине <b>{productAmount}</b></p>
                            <p>Перейти</p>
                        </>}

                    </Button>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => {
                        setProductAmount(productAmount + 1);
                        outherCostsHandler(cost, 1);
                        handleBuy(user.isAuth.id, productId, productAmount + 1);
                    }}><b>+</b></Button>
                </div> :
                <Button variant={colors.bootstrapMainVariant} onClick={() => {
                    if (user.isAuth) {
                        setProductAmount(1)
                        handleBuy(user.isAuth.id, productId, 1);
                    }
                    else {
                        navigate('/profile/login')
                    }
                }}>
                    В корзину
                    <img alt={''} src={cartImg}/>
                </Button>
            }
        </Styled>
    );
});

export default ButtonBuy;