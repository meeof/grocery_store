import React, {useState} from 'react';
import {Carousel, Image} from "react-bootstrap";
import slideHigh from "../../images/slider_high.jpg";
import styled from "styled-components";
import {breakpoints} from "../../StyledGlobal";

const Styled = styled.div`
  .carousel-caption {
    padding: 0;
    top: 40%;
    @media (${breakpoints.small}) {
      top: 20%;
    }
  }
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .3;
    z-index: 9;
  }
  .carousel-caption {
    z-index: 19;
  }
  .carousel-indicators, .carousel-control-prev, .carousel-control-next {
    z-index: 29;
  }
`

const MainSlider = () => {
    const [index, setIndex] = useState(0);
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    return (
        <Styled>
            <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                <Carousel.Item>
                    <Image src={slideHigh} style={{width: '100%'}}/>
                    <Carousel.Caption>
                        <h3>First slide label</h3>
                    </Carousel.Caption>
                    <div className={'shadow'}></div>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={slideHigh} style={{width: '100%'}}/>
                    <Carousel.Caption>
                        <h3>Second slide label</h3>
                    </Carousel.Caption>
                    <div className={'shadow'}></div>
                </Carousel.Item>
                <Carousel.Item>
                    <Image src={slideHigh} style={{width: '100%'}}/>
                    <Carousel.Caption>
                        <h3>Third slide label</h3>
                    </Carousel.Caption>
                    <div className={'shadow'}></div>
                </Carousel.Item>
            </Carousel>
        </Styled>
    );
};

export default MainSlider;