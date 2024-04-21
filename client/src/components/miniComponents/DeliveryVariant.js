import React, {useState} from 'react';
import infoImg from '../../assets/free-icon-font-comment-info-5070433.svg';
import styled from "styled-components";
const Styled = styled.div`
  margin: 10px 10px 0 10px;
  padding-bottom: 10px;
  border-bottom: solid gray 1px;
  .delivery-hide {
    font-size: 14px;
  }
  .delivery-show {
    display: flex;
    align-items: center;

    img {
      width: 16px;
      height: 16px;
      margin-right: 6px;
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