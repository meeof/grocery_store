import React, {useContext} from 'react';
import {Card} from "react-bootstrap";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import noImage from '../../assets/icon-picture.svg';
import DelButton from "../buttons/DelButton";
import * as uf from "../../usefulFunctions";
import {breakpoints, itemCategoryCard} from "../../StyledGlobal";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
import CategoryAddUpdate from "../modals/CategoryAddUpdate";

const Styled = styled.div`
  ${itemCategoryCard};
  @media (${breakpoints.small}) {
    * {
      font-size: 16px;
    }
  }
`

const CategoryCard = observer(({...props}) => {
    const navigate = useNavigate();
    const {item} = useContext(Context);
    return (
            <Styled>
                <Card onClick={() => {
                    item.setItems(null);
                    item.setPage(1);
                    navigate(uf.routePrefix('category', props.id))
                }}>
                    <Card.Img variant="top" src={props.img ? process.env.REACT_APP_API_URL + props.img : noImage} />
                    <Card.Body>
                        <Card.Title>{props.name}</Card.Title>
                    </Card.Body>
                    {props.isAuth?.role === 'ADMIN' && <DelButton delFun={props.delCategory} id={props.id} name={props.name}/>}
                    {(props.isAuth?.id === props.creator || props.isAuth?.role === 'ADMIN') &&
                        <CategoryAddUpdate id={props.id} name={props.name}/>}
                </Card>
            </Styled>
    );
});

export default CategoryCard;