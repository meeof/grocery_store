import React, {useCallback, useContext, useEffect} from 'react';
import {authAPI} from "../api";
import {Context} from "../index";
import Load from "../components/Load";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {
    breakpoints,
    colors,
    customGrid2,
    flexColumn,
    freeButtonWidth,
    marginMedium, marginsCenter,
    marginSmall,
    marginsPage
} from "../StyledGlobal";
import {Button} from "react-bootstrap";
import StatementCard from "../components/cards/StatementCard";
const Styled = styled.div`
  margin-top: ${marginSmall};
  ${marginsPage};
  ${flexColumn};
  justify-content: center;
  .statements-block {
    ${customGrid2};
    margin-bottom: ${marginMedium};
  }
  .show-more {
    width: ${freeButtonWidth};
    ${marginsCenter};
    @media (${breakpoints.small}) {
      width: 100%;
    }
  }
`;

const Statements = observer (() => {
    const {user} = useContext(Context);
    const fetchStatements = useCallback((limit) => {
        authAPI( 'get', '/api/user/allStatements', {limit})
            .then(data => {
                user.setAllStatements(data.rows);
                user.setAllStatementsCount(data.count);
            }).catch(err => {
            console.log(err);
        })
    }, [user]);
    const handlerRefreshStatement = () => {
        fetchStatements(user.allStatementsLimit);
    }
    useEffect(() => {
        if (!user.allStatements) {
            fetchStatements(user.allStatementsLimit)
        }
    }, [user, fetchStatements]);
    return (
        <>{user.allStatements ? <Styled>
            <div className={'statements-block'}>
                {user.allStatements.map(statement => {
                    return <StatementCard statement={statement} key={statement.id} handlerRefreshStatement={handlerRefreshStatement}/>
                })}
            </div>
            {(user.allStatementsCount > user.allStatementsLimit) && <Button variant={colors.bootstrapMainVariant} className={'show-more'}
            onClick={() => {
                user.setAllStatementsLimit(user.allStatementsLimit * 2);
                user.setAllStatements(null);
                fetchStatements(user.allStatementsLimit);
            }}>Показывать больше</Button>}
        </Styled> : <Load/>
        }</>
    );
});

export default Statements;