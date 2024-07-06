import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import * as uf from '../usefulFunctions';
import styled from "styled-components";
import ProductSlider from "../components/sliders/ProductSlider";
import ItemInterface from "../components/item/ItemInterface";
import useWindowSize from "../hooks/useWindowSize";
import ButtonBuy from "../components/buttons/ButtonBuy";
import Reviews from "../components/reviews/Reviews";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {breakpoints, flexColumn, marginsPage, standardValues} from "../StyledGlobal";
import {API} from "../api";
import Load from "../components/Load";
import ItemIcons from "../components/item/ItemIcons";

const Styled = styled.div`
  position: relative;
  .characteristics {
    width: 100%;
    background-color: ${({theme}) => theme.colors.extraLightColor};
    padding: 24px;
    .info {
      display: grid;
      grid-template-columns: 1fr 3fr;
    }
    .info-block {
      width: 100%;
      display: flex;
      border-bottom: 1px dotted ${({theme}) => theme.colors.textColor};
      margin-bottom: ${standardValues.marginSmall};
      .title {
        width: min-content;
        white-space: nowrap;
      }
      .space {
        width: 100%;
        height: 100%;
      }
    }
  }
  .icons {
    grid-column: 1/2;
  }
  .item-container {
    display: grid;
    grid-template-columns: 1fr 4fr 5fr;
    ${marginsPage}
  }
  @media (${breakpoints.small}) {
    padding-bottom: 40px;
    .characteristics {
      padding: 8px;
    }
    .item-container {
      ${flexColumn}
    }
  }
`

const Item = observer (() => {
    const width = useWindowSize();
    const {item, review} = useContext(Context);
    const id = uf.routeUnPrefix(useParams().productId);
    const [slideIndex, setSlideIndex] = useState(0);
    const handleSlideSelect = (selectedIndex) => {
        setSlideIndex(selectedIndex);
    };
    useEffect(() => {
        API('get','/api/item/one', {id}).then(data => {
            item.setOneItem(data);
        }).catch(err => {
            item.setOneItem('Товар недоступен')
        })
    }, [item, id, review]);
    return (
        <>
            {item.oneItem ? <>
                {(typeof item.oneItem === 'object') ?
                    <Styled>
                        <div className={'item-container'}>
                            {width >= breakpoints.rawFromLarge ? <ItemIcons handleSlideSelect={handleSlideSelect}
                                slideIndex={slideIndex} images={item.oneItem.images}/> : <></>
                            }
                            <ProductSlider images={item.oneItem.images} slideIndex={slideIndex}
                                           handleSlideSelect={handleSlideSelect} previews={item.oneItem.images?.[0]}/>
                            <ItemInterface product={item.oneItem}/>
                        </div>
                        {item.oneItem.info.length > 0 && <div className={'characteristics'}>
                            <h3>Характеристики</h3>
                            {item.oneItem.info.map(info => {
                                return <div key={info.id} className={'info'}>
                                    <div className={'info-block'}>
                                        <div className={'title'}>{info.title}</div>
                                        <span className={'space'}></span>
                                        <div>{info.content}</div>
                                    </div>
                                </div>
                            })}
                        </div>}
                        <Reviews itemId={item.oneItem.id}/>
                        {width < breakpoints.rawSmall && <ButtonBuy itemId={item.oneItem.id} fixed={true}/>}
                    </Styled> : <div style={{textAlign: "center"}}>{item.oneItem}</div>}
            </>  : <Load/>}
        </>
    );
});

export default Item;