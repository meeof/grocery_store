import React from 'react';
import styled from "styled-components";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Styled = styled.div`
    display: flex;
  flex-direction: column;
  button {
    font-size: large;
    height: 54px;
    margin-bottom: 0;
    margin-top: auto;
  }
  .promo-block, .all-cost-block {
    display: flex;
    flex-direction: column;
    padding: 15px;
    width: 100%;
    background-color: #f8f9fa;
    border: 1px transparent solid;
    border-radius: 5px;
    height: 160px;
  }
  .promo-block {
    margin-bottom: 10px;
    .link-promo {
      color: #1f7d63;
      margin-top: auto;
      align-self: flex-end;
      text-decoration: underline;
    }
    .form-control {
      margin-top: 10px;
    }
  }
  .all-cost-block {
    > div {
      font-size: x-large;
      font-weight: bold;
      line-height: 1.2;
    }
  }
  @media (min-width: 576px) {
    margin-left: 20px;
  }
`

const AllCostPromoBlock = ({allCost, active}) => {
    const navigate = useNavigate();
    return (
        <Styled>
            <div className={'promo-block'}>
                <b>Введите промокод</b>
                <Form.Control placeholder={'Промокод'}/>
                <div role={"button"} className={'link-promo'}>Активировать</div>
            </div>
            <div className={'all-cost-block'}>
                <div>Итого к оплате:</div>
                <div>{allCost} ₽</div>
                <Button variant={'success'} disabled={active} onClick={() => navigate('order')}>Оформить заказ</Button>
            </div>
        </Styled>
    );
};

export default AllCostPromoBlock;