import React from 'react';
import styled from "styled-components";
const Styled = styled.div`
  width: 100%;
  background-color: #f8f9fa;
  padding: 24px;
  @media (max-width: 575.5px) {
    padding: 8px;
  }
  
  .info-container {
    display: grid;
    grid-template-columns: 1fr 3fr;
  }
  .col-title {
    width: 100%;
    display: flex;
    .title {
      width: min-content;
      margin-right: 5px;
      white-space: nowrap;
    }
    .dot {
      width: 100%;
      border-bottom: 1px dotted black;
      height: min-content;
      color: transparent;
    }
  }
`
const Characteristics =({info}) => {
    let infoTags = info.map(info => {
        return <div key={info.id} className={'info-container'}>
            <div className={'col-title'}>
                <div className={'title'}>{info.title}</div>
                <span className={'dot'}>-</span>
            </div>
            <div className={'col-description'}>{info.description}</div>
        </div>
    });
    return (
        <>
            {info.length !== 0 && <Styled>
                <h3>Характеристики</h3>
                {infoTags}
            </Styled>}
        </>
    );
};

export default Characteristics;