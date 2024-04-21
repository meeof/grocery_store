import React from 'react';
import {Carousel, Image} from "react-bootstrap";
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import noImage from '../assets/free-icon-font-copy-image-9291618.svg';
const Styled = styled.div`
  margin-left: 16px;
  margin-right: 16px;
  grid-column:  ${(props) => (props.$isImages ? "2/3" : "1/3")};
  @media (max-width: 991.5px) {
    grid-column: 1/3;
    margin-left: 0;
  }
  @media (max-width: 575.5px) {
    margin-right: 0;
  }
`

const ProductSlider = ({...props}) => {
    let width = useWindowSize();
    let carouselItems = props.images?.map((img, index) => {
        return <Carousel.Item key={index}>
            <Image src={process.env.REACT_APP_API_URL + img} style={{width: '100%'}}/>
        </Carousel.Item>
    })
    return (
        <Styled $isImages={props.isImages}>
            <Carousel activeIndex={props.slideIndex} onSelect={props.handleSlideSelect} interval={null} variant="dark"
                      indicators={width < 992}>
                {carouselItems}
                {!props.images?.[0] && <Carousel.Item>
                    <Image src={noImage} style={{width: '100%'}}/>
                </Carousel.Item>}
            </Carousel>
        </Styled>
    );
};

export default ProductSlider;