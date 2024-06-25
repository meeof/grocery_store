import React, {useCallback, useContext, useEffect, useState} from 'react';
import styled, {useTheme} from "styled-components";
import Rating from "../Rating";
import lightLikeImgFill from "../../assets/light/icon_like_fill.svg";
import darkLikeImgFill from "../../assets/dark/icon_like_fill.svg";
import lightLikeImg from "../../assets/light/icon_like.svg";
import darkLikeImg from "../../assets/dark/icon_like.svg";
import * as uf from "../../usefulFunctions";
import ButtonBuy from "../buttons/ButtonBuy";
import lightTruckImg from '../../assets/light/icon_truck.svg';
import darkTruckImg from '../../assets/dark/icon_truck.svg';
import DeliveryVariant from "./DeliveryVariant";
import useWindowSize from "../../hooks/useWindowSize";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {useNavigate} from "react-router-dom";
import DelButton from "../buttons/DelButton";
import OneClickBuy from "../buttons/OneClickBuy";
import {
    breakpoints,
    staticColors,
    flexColumn,
    standardValues, Theme
} from "../../StyledGlobal";
import {authAPI} from "../../api";
import ItemAddUpdate from "../modals/ItemAddUpdate";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";

const Styled = styled.div`
  .delivery {
    border: solid ${({theme}) => theme.colors.lightColor} 2px;
    padding-bottom: ${standardValues.marginSmall};
    border-radius: 10px;
    overflow: hidden;
    .delivery-head {
      display: flex;
      align-items: center;
      padding: ${standardValues.marginSmall};
      background-color: ${({theme}) => theme.colors.extraLightColor};
      > { 
        &:first-child {
          background-image: url(${(props) => props.$dark ? darkTruckImg : lightTruckImg});
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
        color: ${({theme}) => theme.colors.main};
      }
    }
  }
  .item-head {
    border-bottom: 1px solid ${({theme}) => theme.colors.descriptionColor};
    margin-bottom: ${standardValues.marginSmall};
    .rating-like {
      display: flex;
      align-items: center;
      margin-bottom: ${standardValues.marginSmall};
    }
    .like-button {
      margin-left: ${standardValues.marginMedium};
      span {
        color: ${({theme}) => theme.colors.main};
      }
      padding-left: 18px;
      background-image: url(${(props) => props.$inFavorites ? 
              (props.$dark ? darkLikeImgFill : lightLikeImgFill) : (props.$dark ? darkLikeImg : lightLikeImg)});
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
    background-color: ${({theme}) => theme.colors.extraLightColor};
    padding: ${standardValues.marginSmall};
    margin-bottom: ${standardValues.marginMedium};
    .buy {
      ${flexColumn};
      align-items: center;
      justify-content: center;
      margin-left: ${standardValues.marginSmall};
      @media (${breakpoints.fromMedium}) {
        width: ${standardValues.freeButtonWidth};
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
        background-color: ${staticColors.opacityRed};
        color: white;
        border: solid transparent 1px;
        border-radius: 5px;
        grid-column: 1/3;
      }
      h3 {
        color: gray;
        text-decoration: line-through;
        margin-left: ${standardValues.marginSmall};
      }
    }
  }
`

const ItemInterface = observer(({product}) => {
    const {user, overlay} = useContext(Context);
    const width = useWindowSize();
    const theme = useTheme();
    const navigate = useNavigate();
    const [inFavorites, setInFavorites] = useState(false);
    const delItem = (id) => {
        authAPI('delete', '/api/item', {id}).then(() => {
            navigate(-1);
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    const checkFavorites = useCallback(() => {
        authAPI('get', '/api/favorites/check', {itemId: product.id}).then((data) => {
            setInFavorites(data);
        }).catch(err => {
            console.log(err.response.data);
        })
    }, [product.id])
    const addDelFavorites = (method) => {
        authAPI(method, '/api/favorites', {itemId: product.id}).then(() => {
            overlay.setMessage(method === 'post' ? `Товар добавлен в избранное` : `Товар удален из избранного`);
            overlay.setColor(theme.colors.mainOpacity);
            overlay.handlerOverlay();
            setInFavorites(method === 'post');
        }).catch(err => {
            overlay.setMessage(err.response?.data || 'Непредвиденная ошибка');
            overlay.setColor(staticColors.opacityRed);
            overlay.handlerOverlay();
        })
    }
    useEffect(() => {
        checkFavorites();
    }, [checkFavorites]);
    let city = 'Москва';
    return (
        <Styled $dark={Theme.dark} $inFavorites={inFavorites}>
            <div className={'item-head'}>
                <h1>
                    {product.name}
                    {(user.isAuth?.id === product.userId || user.isAuth?.role === 'ADMIN') && <>
                        <ItemAddUpdate top={'25px'} right={'64px'} product={product} fullForm={true}
                                       itemInfo={JSON.stringify(product.info)}/>
                        <DelButton top={'25px'} right={'24px'} delFun={delItem} id={product.id} name={product.name}/>
                    </>}
                </h1>
                <div className={'rating-like'}>
                    <Rating disabled={true} itemsId={[product.id]}/>
                    <div role={"button"} className={'like-button'} onClick={(e) =>  {
                        overlay.setTarget(e.target)
                        inFavorites ? addDelFavorites('delete') : addDelFavorites('post');
                    }}>
                        <span>{inFavorites ? 'В избранном' : 'Добавить в избранное'}</span>
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
                    {width >= breakpoints.rawFromSmall && <ButtonBuy itemId={product.id}/>}
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
            <CustomOverlay show={overlay.show} color={overlay.color} target={overlay.target} message={overlay.message}/>
        </Styled>
    );
});

export default ItemInterface;