import React from 'react';
import {Button} from "react-bootstrap";
import styled, {useTheme} from "styled-components";
import lightPencilImg from "../../assets/light/icon_redact.svg";
import darkPencilImg from "../../assets/dark/icon_redact.svg";
import whitePencilImg from "../../assets/icon_redact.svg";
import {Theme} from "../../StyledGlobal";

const Styled = styled.div`
  position: absolute;
  top: ${props => (props.$top ? props.$top : '5px')};
  right: ${props => (props.$right ? props.$right : '40px')};
  ${props => (props.$right ? `right: ${props.$right}` : 'left: 5px')};
  button {
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 3px;
    background-image: url(${(props) => props.$dark ? darkPencilImg : lightPencilImg});
    background-size: 19px;
    background-repeat: no-repeat;
    background-position: center;
    width: 32px;
    height: 32px;
  }
  button:hover {
    background-image: url(${whitePencilImg});
  }
`

const UpdateButton = ({handleModal, isActive, top, right}) => {
    const theme = useTheme();
    return (
        <Styled $top={top} $right={right} $dark={Theme.dark}>
            <Button variant={theme.colors.bootstrapMainVariantOutline} disabled={isActive}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleModal(true);
                    }}/>
        </Styled>
    );
};

export default UpdateButton;