import React, {useState} from 'react';
import {ButtonGroup, Nav, Navbar, ToggleButton} from "react-bootstrap";
import useWindowSize from "../hooks/useWindowSize";
import styled from "styled-components";
import {breakpoints, colors, flexColumn, marginMedium, marginsCenter, marginSmall, marginsPage} from "../StyledGlobal";
const Styled = styled.div`
  background-color: ${colors.extraLightColor};
  .header {
    display: flex;
  }
  .contacts {
    ${flexColumn};
    margin-left: auto;
    text-align: center;
    overflow: hidden;
    @media (${breakpoints.fromSmall})  and (${breakpoints.large}) {
      flex-direction: row;
      justify-content: space-evenly;
      padding-bottom: ${marginSmall};
    }
  }
  .navbar {
    width: 100%;
  }
  .navbar-nav {
    width: 100%;
    padding-left: ${marginMedium};
    > {
      &:first-child {
        white-space: nowrap;
      }
    }
  }
  .nav-link {
    display: flex;
    align-items: center;
  }
  .btn-group {
    ${marginsPage};
    margin-left: auto;
  }
  @media (${breakpoints.fromLarge}) {
    .btn-group {
      margin-left: ${marginMedium};
    }
  }
  @media (${breakpoints.small}) {
    .btn-group {
      top: ${marginSmall};
      right: 8px;
      position: absolute;
      margin: 0 !important;
    }
    .contacts {
      ${marginsCenter};
      padding-right: 16px;
    }
  }
`

const NavBar = () => {
    const [radioValue, setRadioValue] = useState('RU');
    let width = useWindowSize();
    const contacts = <div className={"contacts"}>
        <div className={"me-3"}>Доставка с 8:00 до 23:00</div>
        <div className={"me-3"} role={"button"}>+7(800) 800-80-80</div>
    </div>
    return (
        <Styled>
            <div className={'header'}>
                <Navbar expand="sm" bg="light" data-bs-theme="light">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className={`ms-2 me-auto`}/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className={`me-auto`}>
                            <Nav.Link href="/about">О компании</Nav.Link>
                            <Nav.Link href="/contacts">Контакты</Nav.Link>
                            <Nav.Link href="/shipping">Доставка</Nav.Link>
                            <Nav.Link href="/pay">Оплата</Nav.Link>
                            <Nav.Link href="/blog">Блог</Nav.Link>
                            <Nav.Link href="/profile">Личный кабинет</Nav.Link>
                            {(width >= 992 || width < 576) && contacts}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <ButtonGroup size={"sm"} className={`mb-auto mt-auto`}>
                    <ToggleButton id={`radio-RU`} type="radio" variant={colors.bootstrapOtherVariantOutline} name="radio"
                                  value={'RU'} checked={radioValue === 'RU'}
                                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >RU</ToggleButton>
                    <ToggleButton id={`radio-EN`} type="radio" variant={colors.bootstrapOtherVariantOutline} name="radio"
                                  value={'EN'} checked={radioValue === 'EN'}
                                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                    >EN</ToggleButton>
                </ButtonGroup>
            </div>
            {(width < 992 && width >= 576) && contacts}
        </Styled>
    );
};

export default NavBar;