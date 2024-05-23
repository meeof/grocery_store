import React from 'react';
import noImage from "../assets/free-icon-font-copy-image-9291618.svg";
import styled from "styled-components";
import Rating from "./miniComponents/Rating";
import {useNavigate} from "react-router-dom";
const Styled = styled.div`
display: flex;
  height: 3rem;
  margin: 10px 0;
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
  }
`

const SetProductRatingCard = ({item}) => {
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

export default SetProductRatingCard;