import React, {useContext} from 'react';
import styled from "styled-components";
import {Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as uf from '../../usefulFunctions';
import ButtonBuy from "../buttons/ButtonBuy";
import noImage from '../../assets/icon_no_image.svg';
import DelButton from "../buttons/DelButton";
import {breakpoints, colors, itemCategoryCard} from "../../StyledGlobal";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import ItemAddUpdate from "../modals/ItemAddUpdate";
const Styled = styled.div`
  ${itemCategoryCard};
  .body-block {
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
    background-color: ${colors.opacityRed};
    color: white;
    border: solid transparent 1px;
    border-radius: 5px;
  }
  .old_price {
    color: ${(props) => (props.$disc > 0 ? "gray" : "transparent")};
    text-decoration: line-through;
  }
  @media (${breakpoints.small}) {
    .card-body {
      flex-wrap: wrap;
    }
  }
`

const ItemCard = observer(({...props}) => {
    const {review, item} = useContext(Context);
    const navigate = useNavigate();
    return (
        <Styled $disc={props.product.discount}>
            <Card onClick={() => {
                navigate(uf.routePrefix('product', props.product.id));
                review.setReviews(null);
                item.setOneItem(null);
            }}>
                <Card.Img variant="top" src={props.product.images?.[0] ?
                    process.env.REACT_APP_API_URL + props.product.images?.[0] : noImage} />
                <Card.Body>
                    <div className={'body-block'}>
                        <Card.Text>{props.product.name}</Card.Text>
                        <Card.Title>
                            {uf.getPriceDiscount(props.product.price, props.product.discount)} ₽
                            <div className={'old_price'}>{ props.product.discount > 0 ? props.product.price : '-'} ₽</div>
                        </Card.Title>
                    </div>
                </Card.Body>
                <ButtonBuy itemId={props.product.id}/>
                {props.product.discount > 0 && <span className={'discount'}>-{props.product.discount}%</span>}
                {props.isAuth && <DelButton delFun={props.delItem} id={props.product.id} name={props.product.name}/>}
                {props.isAuth && <ItemAddUpdate product={props.product}/>}
            </Card>
        </Styled>
    );
});

export default ItemCard;