import React from 'react';
import {Card} from "react-bootstrap";
import styled from "styled-components";
import {useNavigate} from "react-router-dom";
import noImage from '../assets/free-icon-font-copy-image-9291618.svg';
import DelButton from "./miniComponents/DelButton";
import UpdateCategory from "./UpdateCategory";

const Styled = styled.div`
  .card {
    width: 15rem;
    margin: 10px;
    cursor: pointer;
  }
  .card-body {
    padding: 5px;
  }
  @media (max-width: 575.5px) {
    width: 48%;
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

const CatalogCategoryCard = ({...props}) => {
    const navigate = useNavigate();
    return (
        <Styled>
            <Card onClick={() => navigate(`category_${props.id}`)}>
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

export default CatalogCategoryCard;