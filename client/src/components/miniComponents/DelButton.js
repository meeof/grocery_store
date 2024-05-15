import React, {useState} from 'react';
import styled from "styled-components";
import {Alert, Button} from "react-bootstrap";

const Styled = styled.div`
  position: absolute;
  top: 5px;
  right: ${props => (props.$productInterface ? '24px' : '5px')};
  z-index: 999;
  button {
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 3px;
    span {
      height: 27px;
      width: 27px;
      font-weight: bold;
    }
  }
  .alert {
    cursor: default;
    font-size: 1rem;
    .alert-heading {
      font-size: 1rem;
    }
  }
`

const DelButton = ({delFun, id, name, productInterface}) => {
    const [show, setShow] = useState(false);
    if (show) {
        if (name.length > 18) {
            name = name.slice(0, 15) + '...'
        }
        name = `"${name}"`
        return (
            <Styled $productInterface={productInterface}>
                <Alert style={{zIndex: 999}} variant="danger" onClose={() => setShow(false)} dismissible
                       onClick={(e) => e.stopPropagation()}>
                    <Alert.Heading>Удалить {name}?</Alert.Heading>
                    <Button variant={"outline-danger"} onClick={() => delFun(id)}>Удалить</Button>
                </Alert>
            </Styled>
        );
    }
    return <Styled $productInterface={productInterface}>
        <Button variant={"outline-danger"} onClick={(e) => {
            e.stopPropagation();
            setShow(!show)
        }}>
            <span>x</span>
        </Button>
    </Styled>
};

export default DelButton;
