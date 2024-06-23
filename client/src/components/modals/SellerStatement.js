import React, {useContext, useEffect, useState} from 'react';
import {breakpoints, marginsCenter, standardValues, Theme} from "../../StyledGlobal";
import {Alert, Button, Modal} from "react-bootstrap";
import useWindowSize from "../../hooks/useWindowSize";
import styled, {useTheme} from "styled-components";
import {authAPI} from "../../api";
import {observer} from "mobx-react-lite";
import {Context} from "../../index";

const Styled = styled.div`
  .yes-no-block {
    width: 50%;
    display: flex;
    justify-content: space-evenly;
    ${marginsCenter};
    >button {
      width: ${standardValues.smallButtonWidth};
    }
  }
`

const SellerStatement = observer (() => {
    const theme = useTheme();
    const width = useWindowSize();
    const {user} = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const handlerStatement = () => {
        authAPI('post','/api/user/statement').then(data => {
            user.setStatement(data);
            setShowModal(false);
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        authAPI('get','/api/user/statement').then(data => {
            user.setStatement(data);
            console.log(user.statement);
        }).catch(err => {
            console.log(err);
        })
    }, [user]);
    return (
        <>
            <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                setShowModal(true);
            }} style={width >= breakpoints.rawFromSmall ? {width: standardValues.freeButtonWidth} : {width: '100%'}}
            disabled={(typeof user.statement === 'string' && user.statement !== 'reject')}>
                {user.statement === 'pending' ? 'Заявка на рассмотрении' : 'Стать продавцом'}
            </Button>
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                backdrop="static"
                keyboard={false}
            >
                <Styled>
                    <Alert style={{zIndex: 999, margin: 0}} variant={theme.colors.bootstrapMainVariant}
                           data-bs-theme={Theme.dark ? "dark" : "light"}
                           onClose={() => setShowModal(false)} dismissible
                           onClick={(e) => e.stopPropagation()}>
                        <Alert.Heading>Подать заявку на рассмотрение ?</Alert.Heading>
                        <p>В случае одобрения вашей заявки администрацией вы сможете создавать и редактировать собственные категории товаров, а также удалять и публиковать товары на продажу. В противном случае вы сможете подать заявку еще раз.</p>
                        <div className={'yes-no-block'}>
                            <Button variant={theme.colors.bootstrapMainVariantOutline} onClick={handlerStatement}>Да</Button>
                            <Button variant={"outline-danger"} onClick={() => {setShowModal(false)}}>Нет</Button>
                        </div>
                    </Alert>
                </Styled>
            </Modal>
        </>
    );
});

export default SellerStatement;