import React from 'react';
import {Carousel, Image} from "react-bootstrap";
import styled from "styled-components";
import useWindowSize from "../../hooks/useWindowSize";
import noImage from '../../assets/icon-picture.svg';
import {breakpoints, staticColors, standardValues} from "../../StyledGlobal";
const Styled = styled.div`
  margin: ${standardValues.marginMedium} 0;
  grid-column:  ${(props) => (props.$previews ? "2/3" : "1/3")};
  @media (${breakpoints.large}) {
    grid-column: 1/3;
    margin-left: 0;
  }
  @media (${breakpoints.small}) {
    margin-right: 0;
  }
`

const ProductSlider = ({...props}) => {
    const width = useWindowSize();
    return (
        <Styled $previews={props.previews}>
            <Carousel activeIndex={props.slideIndex} onSelect={props.handleSlideSelect} interval={null} variant={staticColors.bootstrapOtherVariant}
                      indicators={width < breakpoints.rawLarge}>
                {props.images.length === 0 ? <Carousel.Item>
                    <Image src={noImage} style={{width: '100%'}}/>
                </Carousel.Item> : props.images?.map((img, index) => {
                    return <Carousel.Item key={index}>
                        <Image src={process.env.REACT_APP_API_URL + img} style={{width: '100%'}}/>
                    </Carousel.Item>
                })}
            </Carousel>
        </Styled>
    );
};

export default ProductSlider;