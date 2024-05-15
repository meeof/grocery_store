import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import * as uf from "../usefulFunctions";
import noImage from "../assets/free-icon-font-copy-image-9291618.svg";
import {useNavigate} from "react-router-dom";
import ButtonBuy from "./miniComponents/ButtonBuy";
import {CloseButton} from "react-bootstrap";
import {Context} from "../index";
import {authAPI} from "../http/userAPI";

const Styled = styled.div`
  height: 10rem;
  margin: 10px 0;
  display: flex;
  > img {
    cursor: pointer;
    height: 100%;
    margin-right: 10px;
  }
  .basket-card-end {
    padding: 10px 0;
    justify-self: flex-end;
    margin-left: auto;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    .cost-summary {
      font-size: x-large;
      font-weight: bold;
      line-height: 0.8;
    }
    .button-close {
      margin: 10px 0;
    }
  }
  .basket-card-body {
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    p {
      font-size: x-large;
    }
    h2 {
      cursor: pointer;
    }
  }
`;

const BasketProductCard = ({product, allCost, setAllCost, deleteBasketItemHandle}) => {
    const [allProductCost, setAllProductCost] = useState(0);
    const {user} = useContext(Context);
    useEffect(() => {
        setAllProductCost(product.cost * product.amount)
    }, [product.amount, product.cost]);
    const navigate = useNavigate();
    const navigateProductHandle = () => {
        navigate(
            `/catalog/${uf.routePrefix('category', product.categoryId)}/${uf.routePrefix('product', product.itemId)}`
        )
    }
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(() => {
            user.setAuth(false);
            navigate(`/profile/login`);
        })
    }, [navigate, user]);
    return (
        <Styled>
            <img src={product.image ? process.env.REACT_APP_API_URL + product.image : noImage}
                 alt={''} onClick={navigateProductHandle}/>
            <div className={'basket-card-body'}>
                <h2 onClick={navigateProductHandle}><b>{product.name}</b></h2>
                <p>{product.cost} ₽</p>
                <ButtonBuy productId={product.itemId} cost={product.cost} basket={true}
                           allCost={allCost} setAllCost={setAllCost} allProductCost={allProductCost} setAllProductCost={setAllProductCost}/>
            </div>
            <div className={'basket-card-end'}>
                <CloseButton className={'button-close'} onClick={() => deleteBasketItemHandle(product.userId, product.itemId)}/>
                <div className={'cost-summary'}>
                    {allProductCost} ₽
                </div>
            </div>
        </Styled>
    );
};

export default BasketProductCard;