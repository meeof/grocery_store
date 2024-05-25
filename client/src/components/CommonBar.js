import React, {useContext, useState} from 'react';
import {Button, Form, Image} from "react-bootstrap";
import logo from '../assets/markom_logo.svg'
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import comparisonImg from "../assets/free-icon-font-chart-histogram-5528038.svg";
import cartImg from "../assets/free-icon-font-shopping-cart-3916627.svg";
import userImg from "../assets/free-icon-font-user-3917688.svg";
import searchImg from "../assets/free-icon-font-search-3917132.svg";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Styled = styled.div`
  padding: 8px 24px;
  display: flex;
  justify-content: space-between;
  .form-control {
    margin-left: 5px;
    margin-right: 5px;
  } 
  .logo {
    height: 54px;
  }
  form {
    min-width: 240px;
    max-width: 750px;
    width: 100%;
  }
  .catalog-button {
    @media (min-width: 576px) {
      max-width: 270px;
      margin-right: 10px;
    }
    max-width: 200px !important;
    width: 100%;
  }
  .logo {
    @media (min-width: 576px) {
      margin-right: 10px;
    }
  }
  .search {
    width: 32px;
    height: 32px;
  }
  .controls {
    display: flex;
    align-items: center;
    img {
      width: 32px;
      height: 32px;
      margin-left: 13px;
    }
  }
  @media (min-width: 576px)  and (max-width: 767px) {
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
  @media (max-width: 575.5px) {
    padding: 8px;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .form-control {
      margin-left: 0 !important;
    }
    form, .catalog-button {
      width: 100% !important;
    }
    img {
      height: 54px;
    }
    .controls {
      width: 100%;
      display: flex;
      justify-content: space-evenly;
      margin-top: 10px;
    }
  };
`

const CommonBar = observer (() => {
    const {item, user} = useContext(Context);
    const [find, setFind] = useState(item.find);
    const location = useLocation();
    let width = useWindowSize();
    const navigate = useNavigate();
    const logoElement = <Image src={logo} role={"button"} className={'logo'} onClick={() => navigate('/')}/>
    const catalogButtonElement = <Button variant="success" className={"catalog-button"}
                                         onClick={() => navigate('/catalog')}>Каталог</Button>
    const handlerFind = () => {
        item.setFind(find);
        if (location.pathname === '/catalog/all') {
            user.forceUpdate();
        }
        else {
            navigate('/catalog/all');
        }
    }
    return (
        <Styled>
            {width >= 576 ?
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
                    value={find}
                    onChange={(e) => setFind(e.target.value)}
                />
                <Button variant="success" onClick={handlerFind}
                ><Image src={searchImg} role={"button"} className={'search'}/></Button>
            </Form>
            <div className={"controls"}>
                <Link to={'/profile'}>
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