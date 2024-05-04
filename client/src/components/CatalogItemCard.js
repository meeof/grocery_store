import React from 'react';
import styled from "styled-components";
import {Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as uf from '../usefulFunctions';
import ButtonBuy from "./miniComponents/ButtonBuy";
import noImage from '../assets/free-icon-font-copy-image-9291618.svg';
import DelButton from "./miniComponents/DelButton";
import UpdateProduct from "./UpdateProduct";
const Styled = styled.div`
  .card {
    width: 15rem;
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
    .card-title {
      white-space: nowrap;
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
    .card-body {
      flex-wrap: wrap;
    }
  }
`

const CatalogItemCard = ({...props}) => {
    const navigate = useNavigate();
    return (
        <Styled $disc={props.product.discount}>
            <Card>
                <div onClick={() => navigate(uf.routePrefix('product', props.product.id))}>
                    <Card.Img variant="top" src={props.product.images?.[0] ?
                        process.env.REACT_APP_API_URL + props.product.images?.[0] : noImage} />
                    <Card.Body>
                        <Card.Text>{props.product.name}</Card.Text>
                        <Card.Title>
                            {uf.getPriceDiscount(props.product.price, props.product.discount)} ₽
                            <p className={'old_price'}>{ props.product.discount > 0 ? props.product.price : '-'} ₽</p>
                        </Card.Title>
                    </Card.Body>
                </div>
                <ButtonBuy/>
                {props.product.discount > 0 && <span className={'discount'}>-{props.product.discount}%</span>}
                {props.isAuth && <DelButton delFun={props.delItem} id={props.product.id} name={props.product.name}/>}
                {props.isAuth && <UpdateProduct product={props.product} fetchItems={props.fetchItems}/>}
            </Card>
        </Styled>
    );
};

export default CatalogItemCard;