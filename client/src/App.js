import React, {useContext, useEffect} from 'react';
import AppRouter from "./AppRouter";
import NavBar from "./components/NavBar";
import CommonBar from "./components/CommonBar";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {Context} from "./index";

const Styled = styled.div`

`
const App = observer( () => {
    const {user} = useContext(Context);
    useEffect(() => {
        user.checkAuthUser();
    }, [user]);
    return (
        <Styled>
            <NavBar/>
            <CommonBar/>
            <AppRouter/>
        </Styled>
    );
});

export default App;
