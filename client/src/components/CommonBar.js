import React, {useContext} from 'react';
import {Button, Form, Image} from "react-bootstrap";
import logo from '../assets/logo.svg'
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import comparisonImg from "../assets/icon_comparison.svg";
import cartImg from "../assets/icon_basket_black.svg";
import userImg from "../assets/icon_user.svg";
import searchImg from "../assets/icon_search.svg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {breakpoints, colors, iconsSize, largeButton, marginSmall, marginsPage} from "../StyledGlobal";

const Styled = styled.div`
  margin-top: ${marginSmall};
  margin-bottom: ${marginSmall};
  ${marginsPage};
  display: flex;
  justify-content: space-between;
  .form-control {
    margin-left: ${marginSmall};
    margin-right: ${marginSmall};
  }
  form {
    min-width: 240px;
    max-width: 750px;
    width: 100%;
  }
  .catalog-button {
    ${largeButton};
    width: 100%;
    font-size: x-large;
    max-width: 200px !important;
  }
  .logo {
    ${largeButton};
    margin-right: ${marginSmall};
  }
  .search {
    ${largeButton};
    background-image: url(${searchImg});
    background-size: ${iconsSize};
    background-repeat: no-repeat;
    background-position: center;
    min-width: 54px;
  }
  .controls {
    display: flex;
    align-items: center;
    img {
      width: ${iconsSize};
      margin-left: ${marginSmall};
    }
  }
  @media (${breakpoints.small}) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .form-control {
      margin-left: 0 !important;
    }
    .controls {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      margin-top: ${marginSmall};
    }
    .logo {
      margin-right: 0;
    }
    .catalog-button {
      max-width: 100% !important;
    }
  };
  @media (${breakpoints.fromSmall})  and (${breakpoints.medium}) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    .logo {
      grid-column: 1/3;
      grid-row: 1/2;
    }
    .controls {
      grid-column: 3/5;
      grid-row: 1/2;
      justify-self: flex-end;
    }
    .catalog-button {
      grid-column: 1/2;
      grid-row: 2/3;
    }
    form {
      grid-column: 2/5;
      grid-row: 2/3;
    }
  }
`

const CommonBar = observer (() => {
    const {item, user, render} = useContext(Context);
    const location = useLocation();
    let width = useWindowSize();
    const navigate = useNavigate();
    const logoElement = <Link to={'/'} role={"button"}>
        <Image src={logo} className={'logo'}/>
    </Link>
    const catalogButtonElement = <Link to={'/catalog'} className={"catalog-button"}>
        <Button variant={colors.bootstrapMainVariant} className={"catalog-button"}>Каталог</Button>
    </Link>
    const handlerFind = () => {
        if (location.pathname === '/catalog/all') {
            render.forceUpdate();
        }
        else {
            navigate('/catalog/all');
        }
    }
    return (
        <Styled>
            {width >= breakpoints.rawFromSmall ?
                <>
                    {logoElement}
                    {catalogButtonElement}
                </> : <>
                    {catalogButtonElement}
                    {logoElement}
                </>
            }
            <Form className="d-flex">
                <Form.Control
                    type="search"
                    placeholder="Поиск"
                    className="ms-2"
                    aria-label="Search"
                    id={'commonFind'}
                    value={item.find}
                    onChange={(e) => item.setFind(e.target.value)}
                />
                <Button variant={colors.bootstrapMainVariant} onClick={handlerFind} className={'search'}/>
            </Form>
            <div className={"controls"}>
                <Link to={user.isAuth ? '/profile' : '/profile/login'}>
                    <Image src={userImg} />
                </Link>
                <Link to={'/'}>
                    <Image src={comparisonImg}/>
                </Link>
                <Link to={'/basket'}>
                    <Image src={cartImg}/>
                </Link>
            </div>
        </Styled>
    );
});

export default CommonBar;