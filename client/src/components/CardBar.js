import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import {breakpoints, standardValues} from "../StyledGlobal";
import * as uf from "../usefulFunctions";
import ItemCard from "./cards/ItemCard";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import darkArrowImg from '../assets/dark/icon-bootstrap-arrow.svg';
import lightArrowImg from '../assets/light/icon-bootstrap-arrow.svg';
import darkArrowImgHover from '../assets/dark/icon-bootstrap-arrow-hover.svg'
import lightArrowImgHover from '../assets/light/icon-bootstrap-arrow-hover.svg'

const Styled = styled.div`
  position: relative;
  overflow: clip;
  width: 100%;
  .bar-box {
    display: flex;
    width: 100%;
    transition-duration: 0.4s;
    > {
      div {
        border-left: 3px solid transparent;
        border-right: 3px solid transparent;
      }
    }
  }
  .back-arrow, .forward-arrow {
    min-width: 40px !important;
    height: 100%;
    position: absolute;
    z-index: 9999;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    .arrow {
      width: 40px !important;
      height: 40px !important;
      background-repeat: no-repeat;
      background-position: center;
      background-image: url(${({$dark}) => $dark ? darkArrowImgHover : lightArrowImgHover});
    }
  }
  .back-arrow {
    left: 0;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
    .arrow {
      transform: rotateZ(90deg);
    }
  }
  .forward-arrow {
    top: 0;
    right: 0;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    .arrow {
      transform: rotateZ(270deg);
    }
  }
  .back-arrow:hover, .forward-arrow:hover {
    background-color: rgba(16,18,20, 0.3);
    .arrow {
      background-image: url(${({$dark}) => $dark ? darkArrowImg : lightArrowImg})
    }
  }
`

const CardBar = observer(({field}) => {
    const width = useWindowSize();
    const {user, item} = useContext(Context);
    const cardsShow = {
        small: 2,
        middle: 4,
        large: 6
    }
    let show = cardsShow.large;
    if (width < breakpoints.rawSmall) {
        show = cardsShow.small
    }
    else if (width >= breakpoints.rawFromSmall && width < breakpoints.rawLarge) {
        show = cardsShow.middle
    }
    const [offset, setOffset] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            if (!item[field]) {
                item.setCategoryId('all');
                item.fetchItems(1, field);
            }
        }, 0);
    }, [item, field, offset]);
    const cardWidth = (width - (window.innerWidth - document.body.clientWidth) - (width < breakpoints.rawSmall ?
        standardValues.smallPageMargin * 2 : standardValues.standardPageMargin * 2)) / show;
    return (
        <Styled>
            <div className={'back-arrow'} onClick={() => {
                offset > 0 && setOffset(offset - 1);
            }}>
                <div className={'arrow'}></div>
            </div>
            <div className={'bar-box'} style={{
                transform:
                `translate(${(cardWidth) * offset * -1 + 'px'})`
            }}>
                {item[field] && item[field].map((product) => {
                    return <ItemCard key={uf.routePrefix('item', product.id)} delItem={() => {}}
                                     isAuth={user.isAuth} cardsShow={show}
                                     product={product} field={field} cardWidth={cardWidth}/>
                })}
            </div>
            <div className={'forward-arrow'} onClick={() => {
                offset + show < item[field].length && setOffset(offset + 1)
            }}>
                <div className={'arrow'}></div>
            </div>
        </Styled>
    );
});

export default CardBar;