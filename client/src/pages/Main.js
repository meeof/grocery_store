import React from 'react';
import MainSlider from "../components/MainSlider";
import styled from "styled-components";
const Styled = styled.div`
  margin-left: 24px;
  margin-right: 24px;
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
  }
`

const Main = () => {
    return (
        <Styled>
            <MainSlider/>
        </Styled>
    );
};

export default Main;