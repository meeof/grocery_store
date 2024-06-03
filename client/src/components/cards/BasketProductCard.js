import React, {useState} from 'react';
import styled from "styled-components";
import * as uf from "../../usefulFunctions";
import noImage from "../../assets/icon_no_image.svg";
import {useNavigate} from "react-router-dom";
import ButtonBuy from "../buttons/ButtonBuy";
import {CloseButton} from "react-bootstrap";
import {flexColumn, marginSmall} from "../../StyledGlobal";

const Styled = styled.div`
  height: 10rem;
  margin: ${marginSmall} 0;
  display: flex;
  > img {
    cursor: pointer;
    height: 100%;
    margin-right: ${marginSmall};
  }
  .basket-card-end, .basket-card-body {
    padding: ${marginSmall} 0;
    ${flexColumn};
    justify-content: space-between;
  }
  .basket-card-end {
    justify-self: flex-end;
    margin-left: auto;
    align-items: flex-end;
    
  }
  p {
    font-size: x-large;
  }
  h2 {
    cursor: pointer;
  }
  .cost-summary {
    font-size: x-large;
    font-weight: bold;
  }
`;

const BasketProductCard = ({product, deleteBasketItemHandle}) => {
    const [allProductCost, setAllProductCost] = useState(product.cost * product.amount);
    const navigate = useNavigate();
    const navigateProductHandle = () => {
        navigate(
            `/catalog/${uf.routePrefix('category', product.categoryId)}/${uf.routePrefix('product', product.itemId)}`
        )
    }
    return (
        <Styled>
            <img src={product.image ? process.env.REACT_APP_API_URL + product.image : noImage}
                 alt={''} onClick={navigateProductHandle}/>
            <div className={'basket-card-body'}>
                <h2 onClick={navigateProductHandle}><b>{product.name}</b></h2>
                <p>{product.cost} ₽</p>
                <ButtonBuy productId={product.itemId} cost={product.cost} place={'basket'}
                           allProductCost={allProductCost} setAllProductCost={setAllProductCost}/>
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