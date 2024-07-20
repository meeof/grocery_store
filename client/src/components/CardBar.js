import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import {breakpoints, standardValues, Theme} from "../StyledGlobal";
import * as uf from "../usefulFunctions";
import ItemCard from "./cards/ItemCard";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
import arrowImg from '../assets/icon-bootstrap-arrow.svg';
import arrowImgHover from '../assets/icon-bootstrap-arrow-hover.svg'

const Styled = styled.div`
  position: relative;
  overflow: clip;
  width: 100%;
  margin-bottom: ${standardValues.marginMedium};
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
      background-image: url(${arrowImg});
    }
  }
  .back-arrow {
    left: 0;
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    .arrow {
      transform: rotateZ(90deg);
    }
  }
  .forward-arrow {
    top: 0;
    right: 0;
    border-bottom-right-radius: 3px;
    border-top-right-radius: 3px;
    .arrow {
      transform: rotateZ(270deg);
    }
  }
  .back-arrow:hover, .forward-arrow:hover {
    background-color: rgba(16,18,20, 0.3);
    .arrow {
      background-image: url(${arrowImgHover})
    }
  }
`

const CardBar = observer(({field}) => {
    const width = useWindowSize();
    const {item} = useContext(Context);
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
        if (!item[field]) {
            item.setCategoryId('all');
            item.fetchItems(1, null, field);
        }
    }, [item, field, offset]);
    const cardWidth = (width - (window.innerWidth - document.body.clientWidth) - (width < breakpoints.rawSmall ?
        standardValues.smallPageMargin * 2 : standardValues.standardPageMargin * 2)) / show;
    return (
        <Styled $dark={Theme.dark}>
            {item[field]?.length > show && <div className={'back-arrow'} onClick={() => {
                offset > 0 && setOffset(offset - 1);
            }}>
                <div className={'arrow'}></div>
            </div>}
            <div className={'bar-box'} style={{
                transform:
                `translate(${cardWidth * offset * -1 + 'px'})`
            }}>
                {item[field] && item[field].map((product) => {
                    return <ItemCard key={uf.routePrefix('item', product.id)} delItem={() => {}} cardsShow={show}
                                     product={product} field={field} cardWidth={cardWidth}/>
                })}
            </div>
            {item[field]?.length > show && <div className={'forward-arrow'} onClick={() => {
                offset + show < item[field].length && setOffset(offset + 1)
            }}>
                <div className={'arrow'}></div>
            </div>}
        </Styled>
    );
});

export default CardBar;