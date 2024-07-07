import React from 'react';
import styled from "styled-components";
import {breakpoints, flexColumn, standardValues, Theme} from "../StyledGlobal";
import lightFbImg from "../assets/light/icon-facebook.svg";
import darkFbImg from "../assets/dark/icon-facebook.svg";
import lightTgImg from "../assets/light/icon-telegram.svg";
import darkTgImg from "../assets/dark/icon-telegram.svg";
import lightVkImg from "../assets/light/icon-vk.svg";
import darkVkImg from "../assets/dark/icon-vk.svg";
import {useLocation} from "react-router-dom";
import useWindowSize from "../hooks/useWindowSize";

const Styled = styled.div`
  justify-self: flex-end;
  margin-top: auto;
  ${flexColumn};
  padding-top: ${standardValues.marginSmall};
  padding-bottom: ${standardValues.marginSmall};
  align-items: center;
  margin-bottom: ${({$marginBottom}) => $marginBottom ? '45px' : 0};
  .contacts-block {
    display: flex;
    margin-bottom: ${standardValues.marginSmall};
  }
  [class^='link'] {
    display: block;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    width: ${standardValues.iconsSize};
    height: ${standardValues.iconsSize};
  }
  .link-fb {
    background-image: url(${({$dark}) => $dark ? darkFbImg : lightFbImg});
    margin-right: ${standardValues.marginMedium};
  }
  .link-tg {
    background-image: url(${({$dark}) => $dark ? darkTgImg : lightTgImg});
  }
  .link-vk {
    background-image: url(${({$dark}) => $dark ? darkVkImg : lightVkImg});
    margin-left: ${standardValues.marginMedium};
  }
`

const Footer = () => {
    const location = useLocation();
    const width = useWindowSize();
    let marginBottom = false;
    if (location.pathname.includes('/catalog/') && width < breakpoints.rawSmall) {
        marginBottom = true;
    }
    else {
        marginBottom = false;
    }
    return (
        <Styled $dark={Theme.dark} $marginBottom={marginBottom}>
            <div className={'contacts-block'}>
                <a href='//facebook.com/' className={'link-fb'}> </a>
                <a href='//telegram.org/' className={'link-tg'}> </a>
                <a href='//vk.com/' className={'link-vk'}> </a>
            </div>
            <div className={'label-block'}>2024 Grocery Store</div>
        </Styled>
    );
};

export default Footer;