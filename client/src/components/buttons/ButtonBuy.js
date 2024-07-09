import React, {useContext, useEffect, useState} from 'react';
import {Button} from "react-bootstrap";
import lightCartImg from '../../assets/light/icon_basket_fill.svg';
import darkCartImg from '../../assets/dark/icon_basket_fill.svg';
import styled, {useTheme} from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {authAPI} from "../../api";
import {standardValues, Theme} from "../../StyledGlobal";
const Styled = styled.div`
  position: ${props => (props.$fixed && 'fixed')};
  bottom:  ${props => (props.$fixed && '14px')};
  left: ${props => (props.$fixed && '8px')};
  z-index: 998;
  ${props => (props.$basket && `width: 100px`)};
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
      border-left-color: ${props => (!props.$basket && props.theme.colors.extraLightColor)};
      border-right-color: ${props => (!props.$basket && props.theme.colors.extraLightColor)};
      p {
        margin: 0;
        font-size: 0.9rem;
        line-height: 0.8;
      }
    }
  }
`
const ButtonBuy = observer( ({itemId, cost, place, fixed,
                                 allProductCost, setAllProductCost}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const width = useWindowSize();
    const [productAmount, setProductAmount] = useState(0);
    const {user, basket} = useContext(Context);
    const [fixedWidth, setFixedWidth] = useState('100%')
    const outherCostsHandler = (cost, operator) => {
        basket.setAllCost(basket.allCost + (operator * cost))
        if (allProductCost && setAllProductCost) {
            setAllProductCost(allProductCost + (operator * cost));
        }
    }
    function handleBuy(amount) {
        authAPI( 'post', '/api/basket', {itemId, amount}).then((data) => {
            if (data === 'Unauthorized') {
                navigate('/profile/login');
            }
        }).catch(err => {
            console.log(err);
            navigate('/profile/login');
        })
    }
    useEffect(() => {
        authAPI('get', '/api/basket/amount', {itemId}).then(data => {
            if (data === 'Unauthorized') {
                return
            }
            if (data) {
                setProductAmount(data);
            }
        }).catch(err => {
            console.log(err);
        })
        setTimeout(() => {
            setFixedWidth((width - standardValues.smallPageMargin *
                2 - (window.innerWidth - document.body.clientWidth) + 'px'));
        }, 0)
    }, [itemId, width]);
    return (
        <Styled $fixed={fixed} $basket={place === 'basket'}
                onClick={e => e.stopPropagation()}
        style={{width : fixed ? fixedWidth : '100%'}}>
            {productAmount > 0 ?
                <div className={'buy-start'}>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={() => {
                        if (place === 'basket' && productAmount <= 1) {
                            return
                        }
                        if (place !== 'basket') {
                            basket.setBasket(null);
                        }
                        outherCostsHandler(cost, -1);
                        setProductAmount(productAmount - 1);
                        handleBuy(productAmount - 1);
                    }}><b>-</b></Button>
                    <Button variant={theme.colors.bootstrapMainVariant} className={'to-basket'}
                            onClick={() => navigate('/basket')}>
                        {place === 'basket' ? <b>{productAmount}</b> : <>
                            <p>В корзине <b>{productAmount}</b></p>
                            <p>Перейти</p>
                        </>}
                    </Button>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={() => {
                        if (place !== 'basket') {
                            basket.setBasket(null);
                        }
                        setProductAmount(productAmount + 1);
                        outherCostsHandler(cost, 1);
                        handleBuy(productAmount + 1);
                    }}><b>+</b></Button>
                </div> :
                <Button variant={theme.colors.bootstrapMainVariant} onClick={() => {
                    if (user.isAuth) {
                        setProductAmount(1);
                        handleBuy(1);
                        if (place !== 'basket') {
                            basket.setBasket(null);
                        }
                    }
                    else {
                        navigate('/profile/login')
                    }
                }}>
                    В корзину
                    <img alt={''} src={Theme.dark ? darkCartImg : lightCartImg}/>
                </Button>
            }
        </Styled>
    );
});

export default ButtonBuy;