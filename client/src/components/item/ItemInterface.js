import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import Rating from "../Rating";
import fillComparisonImg from "../../assets/icon_comparison_green.svg";
import * as uf from "../../usefulFunctions";
import ButtonBuy from "../buttons/ButtonBuy";
import truckImg from '../../assets/icon_truck.svg';
import DeliveryVariant from "./DeliveryVariant";
import useWindowSize from "../../hooks/useWindowSize";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import DelButton from "../buttons/DelButton";
import UpdateItem from "../modals/UpdateItem";
import OneClickBuy from "../buttons/OneClickBuy";
import {breakpoints, colors, flexColumn, freeButtonWidth, marginMedium, marginSmall} from "../../StyledGlobal";
import {authAPI, authorization} from "../../api";

const Styled = styled.div`
  .delivery {
    border: solid ${colors.lightColor} 2px;
    padding-bottom: ${marginSmall};
    border-radius: 10px;
    overflow: hidden;
    .delivery-head {
      display: flex;
      align-items: center;
      padding: ${marginSmall};
      background-color: ${colors.extraLightColor};
      > { 
        &:first-child {
          background-image: url(${truckImg});
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: left;
          padding-left: 25px;
        }
      }
      * {
        margin-right: 5px;
      }
      .delivery-city {
        font-weight: bold;
      }
      .change-delivery {
        color: rgb(13,110,253);
      }
    }
  }
  .item-head {
    border-bottom: 1px solid ${colors.descriptionColor};
    margin-bottom: ${marginSmall};
    .rating-comparison {
      display: flex;
      align-items: center;
      margin-bottom: ${marginSmall};
    }
    .comparison-button {
      margin-left: ${marginMedium};
      span {
        color: ${colors.main};
      }
      padding-left: 18px;
      background-image: url(${fillComparisonImg});
      background-size: 16px;
      background-repeat: no-repeat;
      background-position: left;
    }
  }
  .price-buy {
    display: flex;
    justify-content: space-between;
    border: solid transparent 1px;
    border-radius: 10px;
    background-color: ${colors.extraLightColor};
    padding: ${marginSmall};
    margin-bottom: ${marginMedium};
    .buy {
      ${flexColumn};
      align-items: center;
      justify-content: center;
      margin-left: ${marginSmall};
      @media (${breakpoints.fromMedium}) {
        width: ${freeButtonWidth};
      }
    }
    .prices {
      align-items: center;
      width: min-content;
      display: grid;
      grid-template-columns: 1fr 1fr;
      h1, h3 {
        white-space: nowrap;
        margin-bottom: 0;
      }
      .discount {
        width: min-content;
        background-color: ${colors.opacityRed};
        color: white;
        border: solid transparent 1px;
        border-radius: 5px;
        grid-column: 1/3;
      }
      h3 {
        color: gray;
        text-decoration: line-through;
        margin-left: ${marginSmall};
      }
    }
  }
`

const ItemInterface = observer(({product}) => {
    const {user} = useContext(Context);
    let width = useWindowSize();
    const navigate = useNavigate();
    const delItem = (id) => {
        authAPI('delete', '/api/item', {id}).then((data) => {
            navigate(-1);
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    let city = 'Москва';
    useEffect(() => {
        authorization().then(data => {
            user.setAuth(data);
        }).catch(err => {
            user.setAuth(false);
        })
    }, [user]);
    return (
        <Styled>
            <div className={'item-head'}>
                <h1>
                    {product.name}
                    {user.isAuth && <UpdateItem right={'64px'} product={product} page={true}/>}
                    {user.isAuth && <DelButton right={'24px'} delFun={delItem} id={product.id} name={product.name}/>}
                </h1>
                <div className={'rating-comparison'}>
                    <Rating disabled={true} itemsId={[product.id]}/>
                    <div role={"button"} className={'comparison-button'}>
                        <span>Добавить в сравнение</span>
                    </div>
                </div>
            </div>
            <div className={'price-buy'}>
                <div className={'prices'}>
                    {product.discount > 0 && <span className={'discount'}>-{product.discount}%</span>}
                    <h1>{uf.getPriceDiscount(product.price, product.discount)} ₽</h1>
                    <h3>{product.discount > 0 && product.price + ' ₽'}</h3>
                </div>
                <div className={'buy'}>
                    <OneClickBuy itemId={product.id}/>
                    {width > 575.5 && <ButtonBuy productId={product.id}/>}
                </div>
            </div>
            <div className={'delivery'}>
                <div className={'delivery-head'}>
                    <span>Доставка в <span className={'delivery-city'}>{city}</span></span>
                    <span className={'change-delivery'} role={"button"}>Изменить</span>
                </div>
                <DeliveryVariant name={'Самовывоз'} price={'бесплатно'} info={'На пункте выдачи'}/>
                <DeliveryVariant name={'Курьером'} price={'300 ₽'} info={'Доставка курьером'}/>
            </div>
        </Styled>
    );
});

export default ItemInterface;