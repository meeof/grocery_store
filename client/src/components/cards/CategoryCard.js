import React from 'react';
import {Card} from "react-bootstrap";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import noImage from '../../assets/icon_no_image.svg';
import DelButton from "../buttons/DelButton";
import UpdateCategory from "../modals/UpdateCategory";
import * as uf from "../../usefulFunctions";

const Styled = styled.div`
  .card {
    width: 100%;
    cursor: pointer;
  }
  .card-body {
    padding: 5px;
  }
  @media (max-width: 575.5px) {
    .card {
      width: 100%;
      margin: 0 0 10px 0;
      * {
        font-size: 16px;
      }
    }
    .card-title {
      text-align: center;
    }
  }
`

const CategoryCard = ({...props}) => {
    const navigate = useNavigate();
    return (
        <Styled>
            <Card onClick={() => navigate(uf.routePrefix('category', props.id))}>
                <Card.Img variant="top" src={props.img ? process.env.REACT_APP_API_URL + props.img : noImage} />
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                </Card.Body>
                {props.isAuth && <DelButton delFun={props.delCategory} id={props.id} name={props.name}/>}
                {props.isAuth && <UpdateCategory id={props.id} name={props.name}/>}
            </Card>
        </Styled>
    );
};

export default CategoryCard;