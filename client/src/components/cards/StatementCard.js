import React, {useEffect, useState} from 'react';
import styled, {useTheme} from "styled-components";
import {Button} from "react-bootstrap";
import {authAPI} from "../../api";
import ViewUser from "../modals/ViewUser";
import {staticColors, flexColumn, standardValues} from "../../StyledGlobal";
const Styled = styled.div`
  width: 100%;
  ${flexColumn};
  padding: ${standardValues.marginSmall};
  border: solid ${({theme}) => theme.colors.lightColor} 1px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.extraLightColor};
  .buttons-block {
    margin-top: ${standardValues.marginMedium};
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    * {
      font-size: smaller;
    }
  }
  
`

const StatementCard = ({statement, handlerRefreshStatement}) => {
    const theme = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [info, setInfo] = useState(null);
    const handlerStatement = (status) => {
        authAPI('post','/api/user/statement', {status, userId: statement.userId}).then(data => {
            handlerRefreshStatement(null);
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        if (showModal) {
            authAPI('get', '/api/user/info', {id: statement.userId}).then(data => {
                setInfo(data);
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [showModal, statement.userId]);
    return (
        <Styled>
            <Button variant={theme.colors.bootstrapMainVariant} onClick={() => setShowModal(true)}>User: {statement.userId}</Button>
            <div className={'buttons-block'}>
                <Button variant={"danger"} onClick={() => handlerStatement('banned')}>Заблокир.</Button>
                <Button variant={"outline-danger"} onClick={() => handlerStatement('reject')}>Отклонить</Button>
                <Button variant={theme.colors.bootstrapMainVariantOutline} onClick={() => handlerStatement('resolve')}>Принять</Button>
            </div>
            {info && <ViewUser showUser={showModal} setShowUser={setShowModal} name={info.name} surname={info.surname}
                               status={info.status} about={info.about} image={info.img} profileCreated={info.createdAt}/>}
        </Styled>
    );
};

export default StatementCard;