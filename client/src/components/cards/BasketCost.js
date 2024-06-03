import React, {useContext} from 'react';
import {observer} from "mobx-react-lite";
import {colors} from "../../StyledGlobal";
import {Button} from "react-bootstrap";
import {Context} from "../../index";
import {useNavigate} from "react-router-dom";

const BasketCost = observer (() => {
    const navigate = useNavigate();
    const {basket} = useContext(Context);
    return (
        <div className={'other-block'}>
            <div className={'other-cost'}>Итого к оплате:</div>
            <div className={'other-cost'}>{basket.allCost} ₽</div>
            <Button variant={colors.bootstrapMainVariant} disabled={basket.getBasket?.length === 0}
                    onClick={() => navigate('order')}>Оформить заказ</Button>
        </div>
    );
});

export default BasketCost;