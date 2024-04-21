import React from 'react';
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar";
import CommonBar from "./components/CommonBar";
import styled from "styled-components";
import {observer} from "mobx-react-lite";

const Styled = styled.div`

`
const App = observer( () => {
    return (
        <Styled>
            <NavBar/>
            <CommonBar/>
            <AppRouter/>
        </Styled>
    );
});

export default App;
