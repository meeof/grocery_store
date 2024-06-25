import React from 'react';
import noImage from "../../assets/icon-picture.svg";
import styled from "styled-components";
import Rating from "../Rating";
import {useNavigate} from "react-router-dom";
import {standardValues} from "../../StyledGlobal";
const Styled = styled.div`
display: flex;
  height: 3rem;
  margin: ${standardValues.marginMedium} 0;
  justify-content: space-between;
  align-items: center;
  > {
    &:last-child {
      width: min-content;
    }
  }
  img {
    cursor: pointer;
    height: inherit;
    border-radius: 5px;
  }
`

const SetItemRatingCard = ({item}) => {
    const navigate = useNavigate();
    return (
        <Styled>
            <img src={item.img ? process.env.REACT_APP_API_URL + item.img : noImage} alt={''} onClick={() => {
                navigate(`/catalog/all/product_${item.itemId}`)
            }}/>
            <div>{item.name}</div>
            <Rating itemsId={[item.itemId]}/>
        </Styled>
    );
};

export default SetItemRatingCard;