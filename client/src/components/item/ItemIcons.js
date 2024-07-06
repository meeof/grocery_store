import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {standardValues} from "../../StyledGlobal";
import useWindowSize from "../../hooks/useWindowSize";
const Styled = styled.div`
  position: relative;
  overflow: clip;
  width: 100%;
  height: ${(props) => (props.$heightImg) * 4}px;
  img {
    width: 100%;
    box-sizing: border-box;
    height: ${(props) => (props.$heightImg)}px;
  }
  .active {
    border : solid ${({theme}) =>theme.colors.main} 3px !important;
  }
  .icons-box {
    transition-duration: 0.4s;
    min-height: ${(props) => (props.$heightImg) * 4}px;
  }
`
const ItemIcons = ({images, slideIndex, handleSlideSelect}) => {
    const width = useWindowSize();
    const [heightImg, setHeightImg] = useState(0);
    const [increment, setIncrement] = useState(true);
    const icons = images.map((img, index) => {
        return <img alt={''} src={process.env.REACT_APP_API_URL + img} key={index}
                          className={index === slideIndex ? 'active' : 'f'} role={"button"}
                          onClick={() => {
                              handleSlideSelect(index);
                              if (index > slideIndex) {
                                  setIncrement(true);
                              }
                              else {
                                  setIncrement(false);
                              }
                          }}/>
    })
    useEffect(() => {
        setHeightImg((width - (window.innerWidth - document.body.clientWidth) - standardValues.standardPageMargin * 2)/10);
    }, [width]);
    let translate = '';
    if (images.length > 4) {
        if (increment) {
            if (slideIndex > 1) {
                translate = `translate(0, ${heightImg * (slideIndex - 1) * -1 + 'px'})`;
            }
        }
        else {
            if (slideIndex > 2) {
                translate = `translate(0, ${heightImg * (slideIndex - 2) * -1 + 'px'})`;
            }
        }
        if (slideIndex > (images.length - 3)) {
            translate = `translate(0, ${heightImg * (images.length - 4) * -1 + 'px'})`;
        }
    }
    return (
        <Styled $heightImg={heightImg}>
            <div className={'icons-box'} style={{
                transform: translate}}>
                {icons}
            </div>
        </Styled>
    );
};

export default ItemIcons;