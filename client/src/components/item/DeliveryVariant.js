import React, {useState} from 'react';
import infoImg from '../../assets/icon_comment_info.svg';
import styled from "styled-components";
import {marginSmall} from "../../StyledGlobal";
const Styled = styled.div`
  margin: 0 ${marginSmall};
  padding: ${marginSmall} 0;
  border-bottom: solid gray 1px;
  .delivery-hide {
    font-size: smaller;
  }
  .delivery-show {
    display: flex;
    align-items: center;

    img {
      width: 16px;
      height: 16px;
      margin-right: 5px;
    }

    b {
      align-self: flex-end;
      margin-left: auto;
    }
  }
`
const DeliveryVariant = ({name, price, info}) => {
    let [showVariantInfo, setShowVariantInfo] = useState(false);
    return (
        <Styled>
            <div className={'delivery-show'}>
                <div className={'delivery-variant-expand'} role={"button"}
                     onClick={() => setShowVariantInfo(!showVariantInfo)}>
                    <img alt={''} src={infoImg}/>
                    <span>{name}</span>
                </div>
                <b>{price}</b>
            </div>
            {showVariantInfo && <div className={'delivery-hide'}>
                {info}
            </div>}
        </Styled>
    );
};

export default DeliveryVariant;