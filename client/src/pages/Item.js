import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import * as uf from '../usefulFunctions';
import styled from "styled-components";
import ProductSlider from "../components/ProductSlider";
import ItemInterface from "../components/item/ItemInterface";
import useWindowSize from "../hooks/useWindowSize";
import ButtonBuy from "../components/buttons/ButtonBuy";
import Reviews from "../components/reviews/Reviews";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {fetchOneItem} from "../api/itemAPI";
import {breakpoints, colors, flexColumn, marginsPage} from "../StyledGlobal";

const Styled = styled.div`
  position: relative;
  @media (${breakpoints.small}) {
    margin-bottom: 60px;
    .characteristics {
      padding: 8px;
    }
    .item-container {
      ${flexColumn}
    }
  }
  .characteristics {
    width: 100%;
    background-color: ${colors.extraLightGray};
    padding: 24px;
    .info {
      display: grid;
      grid-template-columns: 1fr 3fr;
    }
    .info-title {
      width: 100%;
      display: flex;
      .title {
        width: min-content;
        margin-right: 5px;
        white-space: nowrap;
      }
      .dots {
        width: 100%;
        border-bottom: 1px dotted black;
        height: min-content;
        color: transparent;
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
`
const StyledImg = styled.img`
  width: 100%;
  box-sizing: border-box;
  border: ${(props) => (props.$active && `solid ${colors.primary} 1px !important`)}
`

const Item = observer (() => {
    const {item} = useContext(Context);
    const productId = uf.routeUnPrefix(useParams().productId);
    useEffect(() => {
        fetchOneItem(productId).then(data => {
            item.setOneItem(data);
        })
    }, [item, productId]);
    const [slideIndex, setSlideIndex] = useState(0);
    let width = useWindowSize();
    const handleSlideSelect = (selectedIndex) => {
        setSlideIndex(selectedIndex);
    };
    let infoTags = [];
    if (item.oneItem?.info) {
        infoTags = item.oneItem?.info.map(info => {
            return <div key={info.id} className={'info'}>
                <div className={'info-title'}>
                    <div className={'title'}>{info.title}</div>
                    <span className={'dots'}>-</span>
                </div>
                <div>{info.description}</div>
            </div>
        });
    }
    return (
        <Styled>
            <div className={'item-container'}>
                {width > 992 ?
                    <div className={'icons'}>
                        {item.oneItem.images?.map((img, index) => {
                            return <StyledImg src={process.env.REACT_APP_API_URL + img} key={index}
                                              $active={index === slideIndex} role={"button"}
                                              onClick={() => handleSlideSelect(index)}/>
                        })}
                    </div>
                    :
                    <></>
                }
                <ProductSlider images={item.oneItem.images} slideIndex={slideIndex}
                               handleSlideSelect={handleSlideSelect} isImages={item.oneItem.images?.[0]}/>
                <ItemInterface product={item.oneItem}/>
            </div>
            {infoTags.length > 0 && <div className={'characteristics'}>
                <h3>Характеристики</h3>
                {infoTags}
            </div>}
            <Reviews itemId={item.oneItem.id}/>
            {width < 576 && <ButtonBuy product={item.oneItem} fixed={true}/>}
        </Styled>
    );
});

export default Item;