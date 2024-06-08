import React from 'react';
import noImage from "../../assets/icon_no_image.svg";
import styled from "styled-components";
import {colors, marginMedium, marginSmall} from "../../StyledGlobal";
const Styled = styled.div`
  height: 3rem;
  margin: ${marginSmall} 0;
  display: flex;
  align-items: center;
  width: 100%;
  font-size: large;
  border-bottom: solid 1px ${colors.lightColor};
  > img {
    height: 100%;
    margin-right: ${marginMedium};
  }
  .order-card-text {
    width: 100%;
    display: flex;
    justify-content: space-between;
    b {
      white-space: nowrap;
    }
  }
`;

const OrderItemCard = ({product}) => {
    return (
        <Styled>
            <img src={product.image ? process.env.REACT_APP_API_URL + product.image : noImage} alt={''}/>
            <div className={'order-card-text'}>
                <div>{product.name}</div>
                <b>{product.amount} x {product.cost} ₽</b>
            </div>
        </Styled>
    );
};

export default OrderItemCard;