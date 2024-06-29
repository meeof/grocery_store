import React from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import {deleteFieldButton, standardValues} from "../../StyledGlobal";
const Styled = styled.div`
  margin-bottom: ${standardValues.marginSmall};
  display: flex;
  justify-content: space-between;
  :first-child {
    margin-right: 5px;
  }
  button {
    ${deleteFieldButton};
  }
`
const InfoLinkField = ({...props}) => {
    return (
        <Styled>
            <Form.Control type="text" value={props.title} placeholder={'Наименование'}
                          onChange={(e) =>  props.handler('change', props.place === 'link' ? 'link':'info',
                              props.index, e.target.value, true)}/>
            <Form.Control type="text" value={props.content} placeholder={props.place === 'link' ? 'Адрес' : 'Описание'}
                          onChange={(e) =>  props.handler('change', props.place === 'link' ? 'link':'info', props.index, e.target.value, false)}/>
            <Button variant="danger" onClick={() => props.handler('delete', props.place === 'link' ? 'link':'info', props.index)}/>
        </Styled>
    );
};

export default InfoLinkField;