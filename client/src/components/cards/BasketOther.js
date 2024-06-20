import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {breakpoints, staticColors, flexColumn, largeButton, standardValues} from "../../StyledGlobal";
import {Button, Form} from "react-bootstrap";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";
import styled, {useTheme} from "styled-components";
const Styled = styled.div`
    ${flexColumn}
    button {
      font-size: large;
      ${largeButton};
      margin-bottom: 0;
      margin-top: auto;
    }
    .other-block {
      ${flexColumn};
      padding: 15px;
      width: 100%;
      background-color: ${staticColors.extraLightColor};
      border: 1px transparent solid;
      border-radius: 5px;
      height: 160px;
    }
    .other-cost {
      font-size: x-large;
      font-weight: bold;
      line-height: 1.2;
    }
    .other-promo {
      margin-bottom: 10px;
      .link-promo {
        color: ${({theme}) => theme.colors.main};
        margin-top: auto;
        align-self: flex-end;
        text-decoration: underline;
      }
      .form-control {
        margin-top: ${standardValues.marginSmall}
      }
    }
    @media (${breakpoints.fromSmall}) {
      margin-left: ${standardValues.marginMedium};
    }
`;

const BasketOther = observer (() => {
    const theme = useTheme();
    const navigate = useNavigate();
    const {basket} = useContext(Context);
    return (
        <Styled>
            <div className={'other-block other-promo'}>
                <b>Введите промокод</b>
                <Form.Control placeholder={'Промокод'}/>
                <div role={"button"} className={'link-promo'}>Активировать</div>
            </div>
            <div className={'other-block'}>
                <div className={'other-cost'}>Итого к оплате:</div>
                <div className={'other-cost'}>{basket.allCost} ₽</div>
                <Button variant={theme.colors.bootstrapMainVariant} disabled={basket.getBasket?.length === 0}
                        onClick={() => {
                            basket.setBasket(null);
                            navigate('order')
                        }}>Оформить заказ</Button>
            </div>
        </Styled>
    );
});

export default BasketOther;