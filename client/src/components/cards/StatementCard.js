import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import {Button} from "react-bootstrap";
import {authAPI} from "../../api";
import ViewUser from "../modals/ViewUser";
import {colors, flexColumn, marginMedium, marginSmall} from "../../StyledGlobal";
const Styled = styled.div`
  width: 100%;
  ${flexColumn};
  padding: ${marginSmall};
  border: solid ${colors.lightColor} 1px;
  border-radius: 5px;
  background-color: ${colors.extraLightColor};
  .buttons-block {
    margin-top: ${marginMedium};
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 5px;
    * {
      font-size: smaller;
    }
  }
  
`

const StatementCard = ({statement, handlerRefreshStatement}) => {
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
            <Button variant={colors.bootstrapMainVariant} onClick={() => setShowModal(true)}>User: {statement.userId}</Button>
            <div className={'buttons-block'}>
                <Button variant={"danger"} onClick={() => handlerStatement('banned')}>Заблокир.</Button>
                <Button variant={"outline-danger"} onClick={() => handlerStatement('reject')}>Отклонить</Button>
                <Button variant={"outline-success"} onClick={() => handlerStatement('resolve')}>Принять</Button>
            </div>
            {info && <ViewUser showUser={showModal} setShowUser={setShowModal} name={info.name} surname={info.surname}
                               status={info.status} about={info.about} image={info.img} profileCreated={info.createdAt}/>}
        </Styled>
    );
};

export default StatementCard;