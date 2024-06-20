import React from 'react';
import styled from "styled-components";
let Styled = styled.div`
position: absolute;
  background-color: ${({theme}) => theme.colors.mainOpacity};
  top: -12px;
  right: -12px;
  font-size: 14px;
  width: 18px;
  height: 18px;
  line-height: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid transparent 1px;
  border-radius: 50%;
`

const BadgeCount = ({count}) => {
    return (
        <Styled>
            {count}
        </Styled>
    );
};

export default BadgeCount;