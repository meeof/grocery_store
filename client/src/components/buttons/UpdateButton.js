import React from 'react';
import {Button} from "react-bootstrap";
import styled from "styled-components";
import pencilImg from "../../assets/icon_redact_blue.svg";
import whitePencilImg from "../../assets/icon_redact.svg";

const Styled = styled.div`
  position: absolute;
  top: ${props => (props.$top ? props.$top : '5px')};
  right: ${props => (props.$right ? props.$right : '40px')};
  button {
    padding: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-width: 3px;
    background-image: url(${pencilImg});
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
    return (
        <Styled $top={top} $right={right}>
            <Button variant={"outline-primary"} disabled={isActive}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleModal(true);
                    }}/>
        </Styled>
    );
};

export default UpdateButton;