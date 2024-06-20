import React from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import deleteCross from '../../assets/light/icon_cross.svg';
import {standardValues} from "../../StyledGlobal";
const Styled = styled.div`
  margin-bottom: ${standardValues.marginSmall};
  display: flex;
  justify-content: space-between;
  :first-child {
    margin-right: 5px;
  }
  button {
    min-width: 37.6px;
    margin-left: 5px;
    background-image: url(${deleteCross});
    background-size: 12px;
    background-repeat: no-repeat;
    background-position: center;
  }
`
const ItemInfoField = ({...props}) => {
    return (
        <Styled>
            <Form.Control type="text" value={props.title} placeholder={'Наименование'}
                          onChange={(e) =>  props.changeInfo(props.index, e.target.value, true)}/>
            <Form.Control type="text" value={props.description} placeholder={'Описание'}
                          onChange={(e) =>  props.changeInfo(props.index, e.target.value, false)}/>
            <Button variant="danger" onClick={() => props.deleteInfo(props.index)}/>
        </Styled>
    );
};

export default ItemInfoField;