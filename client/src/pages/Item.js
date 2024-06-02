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
import {breakpoints, colors, flexColumn, marginsPage} from "../StyledGlobal";
import {API} from "../api";

const Styled = styled.div`
  position: relative;
  .characteristics {
    width: 100%;
    background-color: ${colors.extraLightColor};
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
  @media (${breakpoints.small}) {
    margin-bottom: 60px;
    .characteristics {
      padding: 8px;
    }
    .item-container {
      ${flexColumn}
    }
  }
`
const StyledImg = styled.img`
  width: 100%;
  box-sizing: border-box;
  border: ${(props) => (props.$active && `solid ${colors.main} 1px !important`)}
`

const Item = observer (() => {
    const {item} = useContext(Context);
    const id = uf.routeUnPrefix(useParams().productId);
    useEffect(() => {
        API('get','/api/item/one', {id}).then(data => {
            item.setOneItem(data);
        })
    }, [item, id]);
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
                               handleSlideSelect={handleSlideSelect} previews={item.oneItem.images?.[0]}/>
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