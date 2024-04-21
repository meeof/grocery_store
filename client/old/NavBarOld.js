import React, {useEffect, useState} from 'react';
import {ButtonGroup, Container, Nav, Navbar, ToggleButton} from "react-bootstrap";
import styled from "styled-components";
const Styled = styled.div`
  min-width: 250px;
  display: flex;
  background-color: #f8f9fa;
  @media (max-width: 576px) {
    display: grid;
    grid-template-columns: 50% 50%;
    > {
      &:last-child {
        grid-column: 1/3;
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    };
  }
  @media (min-width: 576px)  and (max-width: 767px) {
    grid-auto-flow: column;
    display: grid;
    grid-template-columns: 50% 50%;
    &:first-child {
      grid-column: 1/2;
    }
    &:nth-child(2) {
      grid-area: 3;
    }
  }
  .nav-link {
    color: black;
    white-space: nowrap;
  };
  .navbar-nav, .nav-link.active, .navbar-nav, .nav-link.show {
  color: #1f7d63;
}
`
const Cont = styled.div`
  display: flex;
  justify-content: flex-end;
  .btn-group {
    margin-top: auto;
    @media (max-width: 576px) {
      margin-top: 10px;
    }
  }
  .btn {
    background-color: transparent !important;
    border-left: none;
    border-top: none;
    border-bottom: none;
  };
  .btn:last-child {
    border: none;
  }
  .btn-check:checked+.btn, .btn.active, .btn.show, .btn:first-child:active, :not(.btn-check)+.btn:active {
    color: #1f7d63;
  }
`
const TextInfo = styled.span`
  height: min-content;
  margin-top: auto;
  margin-bottom: auto;
`
const NavBarOld = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = (event) => {
            setWidth(event.target.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const radios = [
        {name: 'RU', value: '1'},
        {name: 'EN', value: '2'},
        {name: 'ES', value: '3'},
    ];
    return (
        <Styled>
            <Navbar expand="sm" bg="light" data-bs-theme="light" className="me-auto ms-5">
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link href="#catalog">Каталог</Nav.Link>
                        <Nav.Link href="#about">О компании</Nav.Link>
                        <Nav.Link href="#contacts">Контакты</Nav.Link>
                        <Nav.Link href="#shipping">Доставка</Nav.Link>
                        <Nav.Link href="#pay">Оплата</Nav.Link>
                        <Nav.Link href="#profile">Личный кабинет</Nav.Link>
                        <Nav.Link href="#blog">Блог</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Cont>
                {width >= 576 &&
                    <>
                        <TextInfo className={"me-3"}>Доставка с 8:00 до 23:00</TextInfo>
                        <TextInfo className={"me-3"} role={"button"}>+7(800) 800-80-80</TextInfo>
                    </>
                }
                <ButtonGroup size={"sm"} className={"mb-auto me-5"}>
                    {radios.map((radio, idx) => (
                        <ToggleButton
                            key={idx}
                            id={`radio-${idx}`}
                            type="radio"
                            variant={'outline-dark'}
                            name="radio"
                            value={radio.value}
                            checked={radioValue === radio.value}
                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                        >
                            {radio.name}
                        </ToggleButton>
                    ))}
                </ButtonGroup>
            </Cont>
            <div>
                {width < 576 &&
                    <>
                        <TextInfo>Доставка с 8:00 до 23:00</TextInfo>
                        <TextInfo role={"button"}>+7(800) 800-80-80</TextInfo>
                    </>
                }
            </div>
        </Styled>
    );
};

export default NavBarOld;