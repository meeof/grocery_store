import React from 'react';
import MainSlider from "../components/MainSlider";
import styled from "styled-components";
import {marginsPage} from "../StyledGlobal";
const Styled = styled.div`
  ${marginsPage}
`

const Main = () => {
    return (
        <Styled>
            <MainSlider/>
        </Styled>
    );
};

export default Main;