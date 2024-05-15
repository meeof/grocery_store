import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import * as uf from '../usefulFunctions';
import styled from "styled-components";
import ProductSlider from "../components/ProductSlider";
import ProductInterface from "../components/ProductInterface";
import useWindowSize from "../hooks/useWindowSize";
import ButtonBuy from "../components/miniComponents/ButtonBuy";
import Characteristics from "../components/Characteristics";
import Reviews from "../components/Reviews";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {fetchOneItem} from "../http/itemAPI";

const Styled = styled.div`
  position: relative;
  @media (max-width: 575.5px) {
    margin-bottom: 60px;
  }
  .icons-block {
    grid-column: 1/2;
  }
  .product-container {
    display: grid;
    grid-template-columns: 1fr 4fr 5fr;
    margin-left: 24px;
    margin-right: 24px;
    @media (max-width: 575.5px) {
      display: flex;
      flex-direction: column;
      margin-left: 8px;
      margin-right: 8px;
    }
  }
  .icons-img {
    width: 100%;
    box-sizing: border-box;
    border: solid transparent 1px;
  }
  .product-interface {
    width: 100%;
  }
`
const StyledImg = styled.img`
  border: ${(props) => (props.$active && "solid #1f7d63 1px !important")}
`

const Product = observer (() => {
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
    return (
        <Styled>
            <div className={'product-container'}>
                {width > 992 ?
                    <div className={'icons-block'}>
                        {item.oneItem.images?.map((img, index) => {
                            return <StyledImg src={process.env.REACT_APP_API_URL + img} key={index}
                                              $active={index === slideIndex} className={'icons-img'}
                                              role={"button"} onClick={() => handleSlideSelect(index)}/>
                        })}
                    </div>
                    :
                    <></>
                }
                <ProductSlider images={item.oneItem.images} slideIndex={slideIndex}
                               handleSlideSelect={handleSlideSelect} isImages={item.oneItem.images?.[0]}/>
                <ProductInterface product={item.oneItem}/>
            </div>
            <Characteristics info={item.oneItem?.info || []}/>
            <Reviews/>
            {width < 576 && <ButtonBuy product={item.oneItem} fixed={true}/>}
        </Styled>
    );
});

export default Product;