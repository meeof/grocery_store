import React, {useState} from 'react';
import {Button} from "react-bootstrap";
import styled from "styled-components";
import pencilImg from "../../assets/free-icon-font-pencil-3917376.svg";
import whitePencilImg from "../../assets/white-pencil-3917376.svg";

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
  }
  img {
    width: 19px;
    height: 19px;
  }
`

const UpdateButton = ({handleModal, isActive, top, right}) => {
    const [hover, setHover] = useState(false)
    return (
        <Styled $top={top} $right={right}>
            <Button variant={"outline-primary"} disabled={isActive}
                    onMouseOver={() => setHover(true)} onMouseLeave={() => setHover(false)}
                    onClick={(e) => {
                        e.stopPropagation();
                        handleModal(true);
                    }}>
                <img alt={''} src={hover ? whitePencilImg : pencilImg}/>
            </Button>
        </Styled>
    );
};

export default UpdateButton;