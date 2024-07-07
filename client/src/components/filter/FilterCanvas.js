import React, {useEffect, useState} from 'react';
import {Button, Form, Offcanvas} from "react-bootstrap";
import {breakpoints, standardValues, Theme} from "../../StyledGlobal";
import styled, {useTheme} from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import stubImage from "../../assets/stub.svg";
import Range from "./Range";
const Styled = styled.div`
  button {
    position: fixed;
    z-index: 999;
    bottom: 14px;
  }
  @media (${breakpoints.fromSmall}) {
    button {
      background-color: ${({theme}) => theme.colors.mainOpacity};
      height: 36px;
      top: 50%;
      transform: rotateZ(270deg);
      left: -135px;
      div {
        width: min-content;
        overflow-wrap: anywhere;
        transform: rotateZ(90deg);
        left: 150px;
        top: -56px;
        position: absolute;
      }
    }
  }
`

const FilterCanvas = ({show, setShow}) => {
    const theme = useTheme();
    const width = useWindowSize();
    const [buttonWidth, setButtonWidth] = useState('100%');
    const [minRange, setMinRange] = useState(0);
    const [maxRange, setMaxRange] = useState(100);
    useEffect(() => {
        setTimeout(() => {
            const checkWidth = (width - standardValues.smallPageMargin *
                2 - (window.innerWidth - document.body.clientWidth) + 'px');
            width < breakpoints.rawSmall && buttonWidth !== checkWidth && setButtonWidth(checkWidth);
        }, 0);
    }, [width, buttonWidth]);
    return (
        <Styled>
            <img style={{display: "none"}} alt={'#'} src={stubImage} onLoad={() => {
                width < breakpoints.rawSmall && setTimeout(() => {
                    const checkWidth = (width - standardValues.smallPageMargin *
                        2 - (window.innerWidth - document.body.clientWidth) + 'px');
                    width < breakpoints.rawSmall && buttonWidth !== checkWidth && setButtonWidth(checkWidth);
                }, 100)
            }}/>
            <Button variant={width < breakpoints.rawSmall ? theme.colors.bootstrapMainVariant : theme.colors.bootstrapMainVariantOutline}
                    onClick={() => setShow(true)}
                    style={{width : width < breakpoints.rawSmall ? buttonWidth : '300px'}}>
                <div>ФИЛЬТР</div>
            </Button>

            <Offcanvas placement={'start'}
                       data-bs-theme={Theme.dark ? "dark" : "light"} show={show} onHide={() => setShow(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Фильтры</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body id={'OffcanvasBody'} >
                    <Form onSubmit={(e) => {e.preventDefault()}}>
                        <Range setMaxRange={setMaxRange} setMinRange={setMinRange} minRange={minRange} maxRange={maxRange}/>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </Styled>
    );
};

export default FilterCanvas;