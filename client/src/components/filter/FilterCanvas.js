import React, {useContext, useEffect, useState} from 'react';
import {Button, ButtonGroup, Dropdown, Form, Offcanvas} from "react-bootstrap";
import {breakpoints, standardValues, Theme} from "../../StyledGlobal";
import styled, {useTheme} from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import stubImage from "../../assets/stub.svg";
import Range from "./Range";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";
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

const FilterCanvas = observer(({show, setShow}) => {
    const productCountries = ['Россия', 'Китай', 'Испания', 'Финляндия', 'Беларусь', 'Армения', 'Уругвай', 'Эквадор', 'Турция', 'Абхазия', 'Эстония', 'Италия', 'Грузия', 'Индия'];
    const productColors = ['Красный', 'Оранжевый', 'Желтый', 'Зеленый', 'Голубой', 'Синий', 'Фиолетовый'];
    const {item} = useContext(Context);
    const theme = useTheme();
    const width = useWindowSize();
    const [buttonWidth, setButtonWidth] = useState('100%');
    const [minRangePrice, setMinRangePrice] = useState(0);
    const [maxRangePrice, setMaxRangePrice] = useState(100);
    const maxPrice = 2000;
    const [minRangeDiscount, setMinRangeDiscount] = useState(0);
    const [maxRangeDiscount, setMaxRangeDiscount] = useState(100);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const handleSelectColors = (key) => {
        key === '' ? setSelectedColor('') :  setSelectedColor(productColors[key]);
    };
    const handleSelectCountries = (key) => {
        key === '' ? setSelectedCountry('') :setSelectedCountry(productCountries[key]);
    };
    const filterHandler = () => {
        item.fetchItems(null, null, null, {
            price : {
                minPrice: Math.round(minRangePrice * maxPrice / 100),
                maxPrice: Math.round(maxRangePrice * maxPrice / 100),
            },
            discount: {
                minDiscount: Math.round(minRangeDiscount),
                maxDiscount: Math.round(maxRangeDiscount),
            },
            color: selectedColor ? selectedColor : null,
            country: selectedCountry ? selectedCountry : null,
        });
    }
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
                    buttonWidth !== checkWidth && setButtonWidth(checkWidth);
                }, 100)
            }}/>
            <Button variant={width < breakpoints.rawSmall ? theme.colors.bootstrapMainVariant : theme.colors.bootstrapMainVariantOutline}
                    onClick={() => setShow(true)}
                    style={{width : width < breakpoints.rawSmall ? buttonWidth : standardValues.freeButtonWidth}}>
                <div>ФИЛЬТР</div>
            </Button>
            <Offcanvas placement={'start'}
                       data-bs-theme={Theme.dark ? "dark" : "light"} show={show} onHide={() => setShow(false)}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Фильтры</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body id={'OffcanvasBody'} >
                    <Form onSubmit={(e) => {
                        e.preventDefault();
                        filterHandler();
                        setShow(false);
                    }} style={{height: '100%', display: "flex", flexDirection: "column"}}>
                        <Range inputs={true} maxValue={maxPrice} label={'Цена'} setMaxRange={setMaxRangePrice} setMinRange={setMinRangePrice} minRange={minRangePrice} maxRange={maxRangePrice}/>
                        <Range inputs={true} label={'Скидка %'} setMaxRange={setMaxRangeDiscount} setMinRange={setMinRangeDiscount} minRange={minRangeDiscount} maxRange={maxRangeDiscount}/>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                            marginBottom: standardValues.marginSmall
                        }}>
                            <div style={{marginBottom: "25px", marginRight: standardValues.marginSmall}}>Страна: </div>
                            <Dropdown drop={'start'}
                                      onSelect={handleSelectCountries}
                                      as={ButtonGroup}
                                      style={{width: '100%', maxWidth: standardValues.freeButtonWidth}}>
                                <Button variant={theme.colors.bootstrapMainVariantOutline}>
                                    {selectedCountry === '' ? 'Все страны' : selectedCountry}
                                </Button>
                                <Dropdown.Toggle split variant={theme.colors.bootstrapMainVariant} id={`dropdown-split-basic-country`} />
                                <Dropdown.Menu>
                                    <Dropdown.Item key={'CountryAll'} eventKey={''} href="#">Все страны</Dropdown.Item>
                                    {productCountries.map((elem, index) => {
                                        return <Dropdown.Item key={'Country' + index} eventKey={index} href="#">{elem}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div style={{
                            display:"flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end"
                        }}>
                            <div style={{marginBottom: "25px", marginRight: standardValues.marginSmall}}>Цвет: </div>
                            <Dropdown drop={'start'}
                                      onSelect={handleSelectColors}
                                      as={ButtonGroup}
                                      style={{width: '100%', maxWidth: standardValues.freeButtonWidth}}>
                                <Button variant={theme.colors.bootstrapMainVariantOutline}>
                                    {selectedColor === '' ? 'Все цвета' : selectedColor}
                                </Button>
                                <Dropdown.Toggle split variant={theme.colors.bootstrapMainVariant} id={`dropdown-split-basic-country`} />
                                <Dropdown.Menu>
                                    <Dropdown.Item key={'ColorAll'} eventKey={''} href="#">Все цвета</Dropdown.Item>
                                    {productColors.map((elem, index) => {
                                        return <Dropdown.Item key={'Color' + index} eventKey={index} href="#" >{elem}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <Button type={"submit"} variant={theme.colors.bootstrapMainVariant} style={{
                            maxWidth: standardValues.freeButtonWidth,
                            width: '80%',
                            marginTop: "auto",
                            alignSelf: "center",
                            marginBottom: standardValues.marginMedium
                        }}>Применить</Button>
                    </Form>
                </Offcanvas.Body>
            </Offcanvas>
        </Styled>
    );
});

export default FilterCanvas;