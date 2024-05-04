import React from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import deleteCross from '../../assets/free-icon-font-cross-3917759.svg';
const Styled = styled.div`
  width: 100%;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  :first-child {
    margin-right: 5px;
  }
  button {
    margin-left: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 12px;
      height: 12px;
      margin: 0 !important;
    }
  }
`
const ProductInfoField = ({...props}) => {
    return (
        <Styled>
            <Form.Control type="text" value={props.title} placeholder={'Наименование'}
                          onChange={(e) =>  props.changeInfo(props.index, e.target.value, true)}/>
            <Form.Control type="text" value={props.description} placeholder={'Описание'}
                          onChange={(e) =>  props.changeInfo(props.index, e.target.value, false)}/>
            <Button variant="danger" onClick={() => props.deleteInfo(props.index)}>
                <img alt={''} src={deleteCross}/>
            </Button>
        </Styled>
    );
};

export default ProductInfoField;