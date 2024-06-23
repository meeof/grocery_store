import React from 'react';
import styled from "styled-components";
import lightCameraImg from "../../assets/light/icon_camera.svg";
import darkCameraImg from "../../assets/dark/icon_camera.svg";
import cameraHoverImg from "../../assets/icon_camera_hover.svg";
import BadgeCount from "../badges_and_overlays/BadgeCount";
import {standardValues, Theme} from "../../StyledGlobal";
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
    background-image: url(${(props) => props.$dark ? darkCameraImg : lightCameraImg});
    &:hover {
      background-image: url(${cameraHoverImg});
    }
  }
`

const AddImagesButton = ({setImages, count, big}) => {
    return (
        <Styled $big={big} $dark={Theme.dark}>
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