import React, {useContext, useEffect, useState} from 'react';
import AppRouter from "./AppRouter";
import NavBar from "./components/NavBar";
import CommonBar from "./components/CommonBar";
import styled, {ThemeProvider} from "styled-components";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {flexColumn, staticColors, Theme} from "./StyledGlobal";
import darkArrowImg from './assets/dark/icon-bootstrap-arrow.svg'
import lightArrowImg from './assets/light/icon-bootstrap-arrow.svg'
import Footer from "./components/Footer";

const Styled = styled.div`
  min-height: ${props => props.$height + 'px'};
  background-color: ${({theme}) => theme.colors.backgroundColor};
  color: ${({theme}) => theme.colors.textColor};
  ${flexColumn};
  justify-content: flex-start;
  .card {
    background-color: ${({theme}) => theme.colors.backgroundColor};
    color: ${({theme}) => theme.colors.textColor};
  }
  button, button, button:hover, button[class*="btn-outline"]:hover {
    color: ${({theme}) => theme.colors.btnTextColor};
  }
  button[class*="btn-outline"] {
    color: ${({theme}) => theme.colors.textColor}
  }
  input[type="text"], input[type="text"]:focus,
  input[type="search"], input[type="search"]:focus, 
  input[type="password"], input[type="password"]:focus,
  input[type="tel"], input[type="tel"]:focus,
  input[type="email"], input[type="email"]:focus,
  textarea {
    background-color: ${({theme}) => theme.colors.inputColor} !important;
    color: ${({theme}) => theme.colors.textColor} !important;
    border-color: ${({theme}) => theme.colors.lightColor} !important;
    position: relative;
  }
  input::placeholder, textarea::placeholder {
    color: ${staticColors.inputPlaceholderColor} !important;
  }
  input[type="text"]:-webkit-autofill,
  input[type="text"]:-webkit-autofill:hover,
  input[type="text"]:-webkit-autofill:focus,
  input[type="search"]:-webkit-autofill,
  input[type="search"]:-webkit-autofill:hover,
  input[type="search"]:-webkit-autofill:focus,
  input[type="password"]:-webkit-autofill,
  input[type="password"]:-webkit-autofill:hover,
  input[type="password"]:-webkit-autofill:focus,
  input[type="tel"]:-webkit-autofill,
  input[type="tel"]:-webkit-autofill:hover,
  input[type="tel"]:-webkit-autofill:focus,
  input[type="email"]:-webkit-autofill,
  input[type="email"]:-webkit-autofill:hover,
  input[type="email"]:-webkit-autofill:focus{
    transition: background-color 0s 600000s, color 0s 600000s !important;
  }
  .dropdown-menu, .dropdown-item {
    background-color: ${({theme}) => theme.colors.inputColor} !important;
    color: ${({theme}) => theme.colors.textColor} !important;
  }
  .dropdown-item:hover {
    background-color: ${({theme}) => theme.colors.dropdownHover} !important;
  }
  .accordion-button, .accordion-collapse, .accordion-item {
    background-color: ${({theme}) => theme.colors.inputColor} !important;
    color: ${({theme}) => theme.colors.textColor} !important;
    border-color: ${({theme}) => theme.colors.lightColor} !important;
  }
  .accordion-button {
    box-shadow: 0 1px ${({theme}) => theme.colors.lightColor} !important;
  }
  .accordion-button:after {
    background-image: url(${({$dark}) => $dark ? darkArrowImg : lightArrowImg})
  }
`
const App = observer( () => {
    const {user} = useContext(Context);
    const height = document.documentElement.clientHeight;
    const [theme, setTheme] = useState('LIGHT');
    const localTheme = localStorage.getItem('theme');
    if (localTheme && theme !== localTheme) {
        setTheme(localTheme);
    }
    if (theme === 'DARK') {
        Theme.setDark(true)
    }
    else if (theme === 'LIGHT') {
        Theme.setDark(false);
    }
    const handlerTheme = (value) => {
        localStorage.setItem('theme', value);
        setTheme(value);
    }
    useEffect(() => {
        user.checkAuthUser();
    }, [user]);
    return (
        <ThemeProvider colors={staticColors} theme={new Theme()}>
            <Styled $height={height} $dark={Theme.dark}>
                <NavBar theme={theme} handlerTheme={handlerTheme}/>
                <CommonBar/>
                <AppRouter/>
                <Footer/>
            </Styled>
        </ThemeProvider>
    );
});
export default App;
