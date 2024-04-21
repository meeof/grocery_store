import React, {useState} from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import deleteCross from '../../assets/free-icon-font-cross-3917759.svg';
const Styled = styled.div`
  width: 100%;
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
const ProductInfoField = ({infoKey, changeInfo}) => {
    const [showComponent, setShowComponent] = useState(true);
    const [thisTitle, setThisTitle] = useState('');
    const [thisDescription, setThisDescription] = useState('');

    return (
        <>
            {showComponent && <Styled>
                <Form.Control type="text" value={thisTitle} placeholder={'Наименование'}
                              onChange={(e) => {
                                  setThisTitle(e.target.value);
                                  changeInfo(infoKey, thisTitle, thisDescription);
                              }}/>
                <Form.Control type="text" value={thisDescription} placeholder={'Описание'}
                              onChange={(e) => {
                                  setThisDescription(e.target.value);
                                  changeInfo(infoKey, thisTitle, thisDescription);
                              }}/>
                <Button variant="danger" onClick={(e) => setShowComponent(false)}>
                    <img alt={''} src={deleteCross}/>
                </Button>
            </Styled>}
        </>
    );
};

export default ProductInfoField;