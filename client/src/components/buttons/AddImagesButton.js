import React from 'react';
import styled from "styled-components";
import cameraImg from "../../assets/icon_camera.svg";
import cameraHoverImg from "../../assets/icon_camera_hover.svg";
import BadgeCount from "../badges_and_overlays/BadgeCount";
import {standardValues} from "../../StyledGlobal";
let Styled = styled.div`
  position: absolute;
  bottom: ${(props) => (props.$big ? '35px' : '10px')};
  right: 15px;
  > input {
    display: none;
  }
  label {
    cursor: pointer;
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    width: ${(props) => (props.$big ? '50px' : standardValues.iconsSize)};
    height: ${(props) => (props.$big ? '50px' : standardValues.iconsSize)};
    background-image: url(${cameraImg});
    &:hover {
      background-image: url(${cameraHoverImg});
    }
  }
`

const AddImagesButton = ({setImages, count, big}) => {
    return (
        <Styled $big={big}>
            <label htmlFor={"reviewFileInput"}>
                {count ? <BadgeCount count={count}/> : ''}
            </label>
            <input id={'reviewFileInput'} multiple type="file" accept="image/*" onChange={(event) => {
                setImages(event.target.files);
            }}/>
        </Styled>
    );
};


export default AddImagesButton;