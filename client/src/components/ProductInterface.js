import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import Rating from "./miniComponents/Rating";
import fillComparisonImg from "../assets/green_free-icon-font-chart-histogram-5528038.svg";
import * as uf from "../usefulFunctions";
import ButtonBuy from "./miniComponents/ButtonBuy";
import truckImg from '../assets/free-icon-font-truck-moving-6955943.svg';
import DeliveryVariant from "./miniComponents/DeliveryVariant";
import useWindowSize from "../hooks/useWindowSize";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import {deleteItem} from "../http/itemAPI";
import DelButton from "./miniComponents/DelButton";
import {authAPI} from "../http/userAPI";
import UpdateProduct from "./UpdateProduct";

const Styled = styled.div`
  @keyframes shopButtonAnim {
    0% {
      background: transparent;
    }
    25% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), transparent, transparent, transparent);
    }
    50% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), transparent ,transparent);
    }
    75% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), transparent);
    }
    100% {
      background: linear-gradient(0.25turn, rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7), rgba(31, 125, 99, 0.7));
    }
  }
  .delivery {
    border: solid lightgray 2px;
    padding-bottom: 10px;
    border-radius: 10px;
    overflow: hidden;
    .delivery-head {
      display: flex;
      align-items: center;
      padding: 10px;
      background-color: #f7f7f7;
      * {
        margin-right: 6px;
      }
      .delivery-city {
        font-weight: bold;
      }
      img {
        width: 20px;
        height: 20px;
      }
      .change-delivery {
        color: #835fef;
      }
    }
  }
  .product-head {
    border-bottom: 1px solid lightgray;
    margin-bottom: 10px;
    .rating-comparison {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    .comparison-button {
      margin-left: 25px;
      span {
        color: #1f7d63;
      }
      img {
        width: 16px;
        height: 16px;
        margin-right: 4px;
      }
    }
  }
  .price-buy {
    display: flex;
    justify-content: space-between;
    border: solid transparent 1px;
    border-radius: 10px;
    background-color: #f7f7f7;
    padding: 10px;
    margin-bottom: 20px;
    .buy {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
      @media (min-width: 767.5px) {
        width: 300px;
        > button {
          width: 100%;
        }
      }
      .one-click-buy {
        width: 100%;
        color: #1f7d63;
        font-weight: bold;
        margin-bottom: 10px;
        border: solid 1px #1f7d63;
        border-radius: 5px;
        padding: 5px;
        text-align: center;
      }
      .one-click-buy:hover {
        animation-name: shopButtonAnim;
        animation-duration: 200ms;
        animation-timing-function: ease-in-out;
        animation-fill-mode: forwards;
        color: white;
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
        background-color: #dc5757;
        color: white;
        border: solid transparent 1px;
        border-radius: 5px;
        grid-column: 1/3;
      }
      h3 {
        color: gray;
        text-decoration: line-through;
        margin-left: 12px;
      }
    }
  }
`

const ProductInterface = observer(({product}) => {
    const {item} = useContext(Context);
    const {user} = useContext(Context);
    let width = useWindowSize();
    const navigate = useNavigate();
    const delItem = (id) => {
        deleteItem(id).then((data) => {
            navigate(-1);
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    let city = 'Москва';
    let rating = item.rating.find(rate => {
        if (rate.itemId === product.id) {
            return rate
        }
        else return false
    });
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(err => {
            user.setAuth(false);
        })
    }, [user]);
    return (
        <Styled>
            <div className={'product-head'}>
                <h1>
                    {product.name}
                    {user.isAuth && <UpdateProduct productInterface={true} product={product} page={true}/>}
                    {user.isAuth && <DelButton productInterface={true} delFun={delItem} id={product.id} name={product.name}/>}
                </h1>
                <div className={'rating-comparison'}>
                    <Rating rating={rating?.rate} digit={true}/>
                    <div role={"button"} className={'comparison-button'}>
                        <img alt={''} src={fillComparisonImg}/>
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
                    <div role={"button"} className={'one-click-buy'}>Купить в 1 клик</div>
                    {width > 575.5 && <ButtonBuy productId={product.id}/>}
                </div>
            </div>
            <div className={'delivery'}>
                <div className={'delivery-head'}>
                    <img alt={''} src={truckImg}/>
                    <span>Доставка в <span className={'delivery-city'}>{city}</span></span>
                    <span className={'change-delivery'} role={"button"}>Изменить</span>
                </div>
                <DeliveryVariant name={'Самовывоз'} price={'бесплатно'} info={'На пункте выдачи'}/>
                <DeliveryVariant name={'Курьером'} price={'300 ₽'} info={'Доставка курьером'}/>
            </div>
        </Styled>
    );
});

export default ProductInterface;