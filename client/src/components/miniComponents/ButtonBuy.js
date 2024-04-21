import React from 'react';
import {Button} from "react-bootstrap";
import cartImg from '../../assets/white-free-icon-font-shopping-cart-3916627.svg';
import styled from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import useGetScrollBar from "../../hooks/useGetScrollBar";
const Styled = styled.div`
  position: ${props => (props.$fixed && 'fixed')};
  bottom:  ${props => (props.$fixed && '14px')};
  left: ${props => (props.$fixed && '8px')};
  width: ${props => (props.$fixed && props.$width - ((props.$scroll > 0 ? props.$scroll : 0) + 16) + 'px')};
  z-index: 99;
  button {
    width: 100%;
  }
  img {
    margin-left: 4px;
    width: 16px;
    height: 16px;
  } 
`
const ButtonBuy = ({fixed}) => {
    let width = useWindowSize();
    let scrollBar = useGetScrollBar();
    return (
        <Styled $fixed={fixed} $width={width} $scroll={scrollBar}>
            <Button variant="success">
                В корзину
                <img alt={''} src={cartImg}/>
            </Button>
        </Styled>
    );
};

export default ButtonBuy;