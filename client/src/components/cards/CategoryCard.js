import React, {useContext} from 'react';
import {Card} from "react-bootstrap";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import noImage from '../../assets/icon_no_image.svg';
import DelButton from "../buttons/DelButton";
import UpdateCategory from "../modals/UpdateCategory";
import * as uf from "../../usefulFunctions";
import {breakpoints, itemCategoryCard} from "../../StyledGlobal";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

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
                navigate(uf.routePrefix('category', props.id))
            }}>
                <Card.Img variant="top" src={props.img ? process.env.REACT_APP_API_URL + props.img : noImage} />
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                </Card.Body>
                {props.isAuth && <DelButton delFun={props.delCategory} id={props.id} name={props.name}/>}
                {props.isAuth && <UpdateCategory id={props.id} name={props.name}/>}
            </Card>
        </Styled>
    );
});

export default CategoryCard;