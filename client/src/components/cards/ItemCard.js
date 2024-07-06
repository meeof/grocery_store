import React, {useContext} from 'react';
import styled from "styled-components";
import {Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import * as uf from '../../usefulFunctions';
import ButtonBuy from "../buttons/ButtonBuy";
import noImage from '../../assets/icon-picture.svg';
import DelButton from "../buttons/DelButton";
import {breakpoints, staticColors, itemCategoryCard} from "../../StyledGlobal";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import ItemAddUpdate from "../modals/ItemAddUpdate";

const Styled = styled.div`
  ${itemCategoryCard};
  box-sizing: border-box !important;
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
    top: 40px;
    left: 5px;
    background-color: ${staticColors.opacityRed};
    color: white;
    border: solid transparent 1px;
    border-radius: 5px;
  }
  .old_price {
    color: ${(props) => (props.$disc > 0 ? "gray" : "transparent")};
    text-decoration: line-through;
  }
  [class^='bar-decoration'] {
    border-radius: 5px;
    border: solid transparent 2px;
    width: 100%;
    white-space: nowrap;
    padding: 5px;
    font-weight: bold;
    margin-left: auto;
    display: flex;
    justify-content: center;
  }
  .bar-decoration-new {
    border-color: ${({theme}) => theme.colors.main};
    color: ${({theme}) => theme.colors.main};
  }
  .bar-decoration-discount {
    border-color: #DC3545;
    color: #DC3545;
  }
  .bar-decoration-popular {
    border-color: #E86E30;
    color: #E86E30;
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
        <Styled $disc={props.product.discount}
        style={{minWidth: props.cardWidth + 'px', width: props.cardWidth + 'px'}}>
            <Card onClick={() => {
                props.field ? navigate('/catalog/all/' + uf.routePrefix('product', props.product.id)) :
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
                            <div className={'old_price'}>{ props.product.discount > 0 ? props.product.price : '-'} ₽</div>
                            {uf.getPriceDiscount(props.product.price, props.product.discount)} ₽
                        </Card.Title>
                    </div>
                </Card.Body>
                {!props.field && <ButtonBuy itemId={props.product.id}/>}
                {props.field === 'popular' && <div className={'bar-decoration-popular'}>Продано {props.product.count}</div>}
                {props.field === 'new' && <div className={'bar-decoration-new'}>NEW</div>}
                {props.field === 'discount' && <div className={'bar-decoration-discount'}>- {props.product.discount} %</div>}
                {(props.product.discount > 0 && props.field !== 'discount') && <span className={'discount'}>-{props.product.discount}%</span>}
                {((props.field === 'favorites') || !props.field) && (props.isAuth?.id === props.product?.userId || props.isAuth?.role === 'ADMIN') && <>
                    <DelButton field={props.field} delFun={props.delItem} id={props.product.id} name={props.product.name}/>
                    {(props.field !== 'favorites') && <ItemAddUpdate product={props.product}/>}
                    </>}
            </Card>
        </Styled>
    );
});

export default ItemCard;