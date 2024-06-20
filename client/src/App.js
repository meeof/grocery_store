import React, {useContext, useEffect, useState} from 'react';
import AppRouter from "./AppRouter";
import NavBar from "./components/NavBar";
import CommonBar from "./components/CommonBar";
import styled, {ThemeProvider} from "styled-components";
import {observer} from "mobx-react-lite";
import {Context} from "./index";
import {staticColors, Theme} from "./StyledGlobal";

const Styled = styled.div`

`
const App = observer( () => {
    const {user} = useContext(Context);
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
            <Styled>
                <NavBar theme={theme} handlerTheme={handlerTheme}/>
                <CommonBar/>
                <AppRouter/>
            </Styled>
        </ThemeProvider>
    );
});

export default App;
