import React, {useState} from 'react';
import styled from "styled-components";
import {Alert, Button} from "react-bootstrap";
import {Theme} from "../../StyledGlobal";
import redCrossImg from "../../assets/icon_cross_red.svg";
import whiteCrossImg from "../../assets/icon_cross_white.svg";
import redLikeImg from "../../assets/icon_like_red.svg";
import whiteLikeImg from "../../assets/icon_like_white.svg";

const Styled = styled.div`
  position: absolute;
  top: ${props => (props.$top ? props.$top : '5px')};
  right: ${props => (props.$right ? props.$right : '5px')};
  z-index: 999;
  button {
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 3px;
    background-image: url(${props => (props.$favorites ? redLikeImg : redCrossImg)});
    background-size: 19px;
    background-repeat: no-repeat;
    background-position: center;
    width: 32px;
    height: 32px;
  }
  button:hover {
    background-image: url(${props => (props.$favorites ? whiteLikeImg : whiteCrossImg)});
  }
  .alert {
    cursor: default;
    font-size: 1rem;
    right: ${props => (props.$right ? -props.$right : '-5px')};
    top: ${props => (props.$top ? -props.$top : '-5px')};
    .alert-heading {
      font-size: 1rem;
    }
    button {
      color: ${({theme}) => theme.colors.textColor}
    }
  }
`

const DelButton = ({favorites, delFun, id, name, top, right}) => {
    const [show, setShow] = useState(false);
    if (show) {
        if (name && name.length > 18) {
            name = name.slice(0, 15) + '...'
            name = `"${name}"`
        }
        return (
            <Styled $top={top} $right={right}>
                <Alert data-bs-theme={Theme.dark ? "dark" : "light"} className={'alert-del'} style={{zIndex: 999}} variant="danger" onClose={() => setShow(false)} dismissible
                       onClick={(e) => e.stopPropagation()}>
                    <Alert.Heading>Удалить {name && name}?</Alert.Heading>
                    <Button variant={"outline-danger"} onClick={() => delFun(id)}>Удалить</Button>
                </Alert>
            </Styled>
        );
    }
    return <Styled $top={top} $right={right} $favorites={favorites}>
        <Button variant={"outline-danger"} onClick={(e) => {
            e.stopPropagation();
            if (favorites) {
                delFun(id)
            }
            else {
                setShow(!show)
            }
        }}>
        </Button>
    </Styled>
};

export default DelButton;
