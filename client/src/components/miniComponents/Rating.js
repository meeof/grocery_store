import React from 'react';
import starImg from '../../assets/star_3916582.svg';
import starImgFill from '../../assets/star_3916581_fill.svg';
import styled from "styled-components";
const Styled = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: min-content;
  span {
    vertical-align: center;
    font-weight: bold;
  }
  img {
    width: 16px;
    height: 16px;
    margin-right: 4px;
  }
`

const Rating = ({rating}) => {
    let imgStars = [];
    for (let i=0; i < 5; i++) {
        imgStars.push(<img key={i} alt={'star'} src={i < rating ? starImgFill : starImg}/>)
    }
    return (
        <Styled>
            {imgStars}
            <span>({rating})</span>
        </Styled>
    );
};

export default Rating;