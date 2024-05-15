import React from 'react';
import noImage from "../assets/free-icon-font-copy-image-9291618.svg";
import styled from "styled-components";
const Styled = styled.div`
  height: 3rem;
  margin: 10px 0;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 550px;
  > div {
    height: 20px;
  }
  > img {
    height: 100%;
    margin-right: 10px;
  }
  .order-card-text {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    > {
      &:first-child {
        justify-self: flex-start;
        margin-right: auto;
        margin-left: 20px;
      }
    }
    * {
      line-height: 1;
      white-space: nowrap;
    }
    b {
      font-size: 20px;
    }
  }
`;

const OrderProductCard = ({product}) => {
    return (
        <Styled>
            <img src={product.image ? process.env.REACT_APP_API_URL + product.image : noImage} alt={''}/>
            <div className={'order-card-text'}>
                <div>{product.name}</div>
                <div>{product.amount} x </div>
                <b>{product.cost} ₽</b>
            </div>
        </Styled>
    );
};

export default OrderProductCard;