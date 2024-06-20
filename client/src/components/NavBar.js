import React, {useContext} from 'react';
import {ButtonGroup, Nav, Navbar, ToggleButton} from "react-bootstrap";
import useWindowSize from "../hooks/useWindowSize";
import styled from "styled-components";
import {
    breakpoints,
    staticColors,
    flexColumn,
    marginsCenter,
    marginsPage, standardValues, Theme
} from "../StyledGlobal";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import sunImg from "../assets/light/icon_sun.svg";
import moonImg from "../assets/light/icon_moon.svg";
import sunImgDark from "../assets/dark/icon_sun.svg";
import moonImgDark from "../assets/dark/icon_moon.svg";
import {observer} from "mobx-react-lite";

const Styled = styled.div`
  background-color: ${staticColors.extraLightColor};
  .header {
    display: flex;
  }
  .theme-light, .theme-dark {
    background-size: 25px;
    background-repeat: no-repeat;
    background-position: center;
    width: 36px;
    height: 30px;
  }
  .theme-light {
    background-image: url(${(props) => props.$dark ? sunImgDark : sunImg});
  }
  .theme-dark {
    background-image: url(${(props) => props.$dark ? moonImgDark : moonImg});
  }
  .contacts {
    ${flexColumn};
    margin-left: auto;
    text-align: center;
    overflow: hidden;
    @media (${breakpoints.fromSmall})  and (${breakpoints.large}) {
      flex-direction: row;
      justify-content: space-evenly;
      padding-bottom: ${standardValues.marginSmall};
    }
  }
  .navbar {
    width: 100%;
  }
  .navbar-nav {
    width: 100%;
    padding-left: ${standardValues.marginMedium};
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
      margin-left: ${standardValues.marginMedium};
    }
  }
  @media (${breakpoints.small}) {
    .btn-group {
      top: ${standardValues.marginSmall};
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
const NavBar = observer(({theme, handlerTheme}) => {
    const width = useWindowSize();
    const navigate = useNavigate();
    const {user, render} = useContext(Context);
    const contacts = <div className={"contacts"}>
        <div className={"me-3"}>Доставка с 8:00 до 23:00</div>
        <div className={"me-3"} role={"button"}>+7(800) 800-80-80</div>
    </div>
    return (
        <Styled $dark={Theme.dark}>
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
                            <Nav.Link onClick={e => {
                                e.preventDefault();
                                navigate(user.isAuth ? '/profile' : '/profile/login')
                            }}>
                                Личный кабинет
                            </Nav.Link>
                            {(width >= breakpoints.rawFromLarge || width < breakpoints.rawSmall) && contacts}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <ButtonGroup size={"sm"} className={`mb-auto mt-auto`}>
                    <ToggleButton id={`radio-RU`} type="radio" variant={staticColors.bootstrapOtherVariantOutline} name="radio"
                                  value={'LIGHT'} checked={theme === 'LIGHT'}
                                  onChange={(e) => {
                                      handlerTheme(e.currentTarget.value);
                                  }}
                                  className={'theme-light'}
                    ></ToggleButton>
                    <ToggleButton id={`radio-EN`} type="radio" variant={staticColors.bootstrapOtherVariantOutline} name="radio"
                                  value={'DARK'} checked={theme === 'DARK'}
                                  onChange={(e) => {
                                      handlerTheme(e.currentTarget.value);
                                      render.forceUpdate();
                                  }}
                                  className={'theme-dark'}
                    ></ToggleButton>
                </ButtonGroup>
            </div>
            {(width < breakpoints.rawLarge && width >= breakpoints.rawFromSmall) && contacts}
        </Styled>
    );
});

export default NavBar;