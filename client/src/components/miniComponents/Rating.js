import React from 'react';
import starImg from '../../assets/star_3916582.svg';
import starImgFill from '../../assets/star_3916581_fill.svg';
import styled from "styled-components";
const Styled = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  width: ${(props) => (props.$digit ? "min-content" : "100%")};
  justify-content: ${(props) => (props.$digit ? "flex-start" : "space-evenly")};
  span {
    vertical-align: center;
    font-weight: bold;
  }
  img {
    width: ${(props) => (props.$big ? "32px" : "16px")};
    margin-right: 4px;
  }
`

const Rating = ({rating, digit, big}) => {
    let imgStars = [];
    for (let i=0; i < 5; i++) {
        imgStars.push(<img key={i} alt={'star'} src={i < rating ? starImgFill : starImg}/>)
    }
    return (
        <Styled $digit={digit} $big={big}>
            {imgStars}
            {digit && <span>({rating})</span>}
        </Styled>
    );
};

export default Rating;