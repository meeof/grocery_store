import React, {useContext, useEffect, useState} from 'react';
import AppRouter from "./AppRouter";
import NavBar from "./components/NavBar";
import CommonBar from "./components/CommonBar";
import styled, {ThemeProvider} from "styled-components";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {staticColors, Theme} from "./StyledGlobal";

const Styled = styled.div`
  min-height: ${props => props.$height + 'px'};
  background-color: ${({theme}) => theme.colors.backgroundColor};
  color: ${({theme}) => theme.colors.textColor};
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
`
const App = observer( () => {
    const {user} = useContext(Context);
    const height = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
    )
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
            <Styled $height={height}>
                <NavBar theme={theme} handlerTheme={handlerTheme}/>
                <CommonBar/>
                <AppRouter/>
            </Styled>
        </ThemeProvider>
    );
});
export default App;
