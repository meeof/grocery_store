import React from 'react';
import styled from "styled-components";
import {Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as uf from '../usefulFunctions';
import ButtonBuy from "./miniComponents/ButtonBuy";
import noImage from '../assets/free-icon-font-copy-image-9291618.svg';
const Styled = styled.div`
  .card {
    width: 16rem;
    margin: 10px;
    cursor: pointer;
  }
  .card-body {
    padding: 5px;
    display: flex;
    justify-content: space-between;
    * {
      margin-bottom: 0;
    }
  }
  .discount {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: #dc5757;
    color: white;
    border: solid transparent 1px;
    border-radius: 5px;
  }
  .old_price {
    color: ${(props) => (props.$disc > 0 ? "gray" : "transparent")};
    text-decoration: line-through;
  }
  .card-text, .old_price {
    margin-bottom: 8px;
  }
  @media (max-width: 575.5px) {
    width: 48%;
    .card {
      width: 100%;
      margin: 0 0 10px 0;
    }
  }
`

const CatalogItemCard = ({...props}) => {
    const navigate = useNavigate();
    return (
        <Styled $disc={props.discount}>
            <Card onClick={() => navigate(uf.routePrefix('product', props.id))}>
                <Card.Img variant="top" src={props.img ? process.env.REACT_APP_API_URL + props.img : noImage} />
                <Card.Body>
                    <Card.Text>{props.name}</Card.Text>
                    <Card.Title>
                        {uf.getPriceDiscount(props.price, props.discount)} ₽
                        <p className={'old_price'}>{ props.discount > 0 ? props.price : '-'} ₽</p>
                    </Card.Title>
                </Card.Body>
                <ButtonBuy/>
                {props.discount > 0 && <span className={'discount'}>-{props.discount}%</span>}
            </Card>
        </Styled>
    );
};

export default CatalogItemCard;