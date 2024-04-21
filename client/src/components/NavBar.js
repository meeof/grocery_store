import React, {useState} from 'react';
import {ButtonGroup, Nav, Navbar, ToggleButton} from "react-bootstrap";
import useWindowSize from "../hooks/useWindowSize";
import styled from "styled-components";
const Styled = styled.div`
  background-color: #f8f9fa;
  @media (min-width: 576px)  and (max-width: 991.5px) {
    .navbar {
      padding-bottom: 0;
    }
  }
  .link-cont {
    display: flex;
  }
  .info-block {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    text-align: center;
    overflow: hidden;
    @media (max-width: 359.5px) {
      font-size: 12px;
      position: absolute;
      left: 30%;
    }
    @media (min-width: 576px)  and (max-width: 991.5px) {
      flex-direction: row;
      justify-content: space-evenly;
    }
  }
  @media (max-width: 575.5px) {
    .btn-group {
      margin-top: 8px !important;
    }
  }
  * {
    @media (min-width: 576px) {
      text-align: center;
    }
  };
 .hide_symbol {
   color: transparent;
 }
  .nav-link {
  @media (max-width: 767px) {
      padding-right: 4px !important;
      padding-left: 4px !important;
    }
  }
`

const NavBar = () => {
    const [radioValue, setRadioValue] = useState('RU');
    let width = useWindowSize();
    return (
        <Styled>
            <div className={'link-cont'}>
                <Navbar expand="sm" bg="light" data-bs-theme="light">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className={`ms-2 me-auto`}/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className={`${width < 576 ? 'ms-3' : 'ms-4'} me-auto`}>
                            <Nav.Link href="/catalog">Каталог</Nav.Link>
                            <Nav.Link href="/about">О<span className={'hide_symbol'}>.</span>компании</Nav.Link>
                            <Nav.Link href="/contacts">Контакты</Nav.Link>
                            <Nav.Link href="/shipping">Доставка</Nav.Link>
                            <Nav.Link href="/pay">Оплата</Nav.Link>
                            <Nav.Link href="/profile">Личный кабинет</Nav.Link>
                            <Nav.Link href="/blog">Блог</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                {(width >= 992 || width < 576) && <div className={"info-block"}>
                    <div className={"me-3"}>{width > 360 ? 'Доставка с 8:00 до 23:00' : '8:00 - 23:00'}</div>
                    <div className={"me-3"} role={"button"}>+7(800) 800-80-80</div>
                </div>}
                <ButtonGroup size={"sm"} className={`${width < 576 ? 'me-2' : 'me-4'} ${width >= 992 ? 'ms-5' : 'ms-auto'} mb-auto mt-auto`}>
                    <ToggleButton id={`radio-RU`} type="radio" variant={'outline-dark'} name="radio"
                                  value={'RU'} checked={radioValue === 'RU'}
                                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >RU</ToggleButton>
                    <ToggleButton id={`radio-EN`} type="radio" variant={'outline-dark'} name="radio"
                                  value={'EN'} checked={radioValue === 'EN'}
                                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >EN</ToggleButton>
                </ButtonGroup>
            </div>
            {(width < 992 && width > 576) && <div className={"info-block"}>
                <div className={"me-3"}>Доставка с 8:00 до 23:00</div>
                <div className={"me-3"} role={"button"}>+7(800) 800-80-80</div>
            </div>}
        </Styled>
    );
};

export default NavBar;