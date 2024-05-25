import React from 'react';
import styled from "styled-components";
import noImage from "../../assets/icon_no_image.svg";
import BadgeCount from "../badges_and_overlays/BadgeCount";
let Styled = styled.div`
  position: absolute;
  bottom: ${(props) => (props.$big ? '35px' : '10px')};
  right: 15px;
  > input {
    display: none;
  }
  label {
    > img {
      height: ${(props) => (props.$big ? '50px' : '30px')};
      width: ${(props) => (props.$big ? '50px' : '30px')};
      cursor: pointer;
    }
  }
`

const AddImagesButton = ({setImages, count, big}) => {
    return (
        <Styled $big={big}>
            <label htmlFor={"reviewFileInput"}>
                <img alt={'#'} src={noImage}/>
                {count ? <BadgeCount count={count}/> : ''}
            </label>
            <input id={'reviewFileInput'} multiple type="file" accept="image/*" onChange={(event) => {
                setImages(event.target.files);
            }}/>
        </Styled>
    );
};

export default AddImagesButton;