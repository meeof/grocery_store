import React, {useContext, useEffect, useState} from 'react';
import {Button, Pagination} from "react-bootstrap";
import styled, {useTheme} from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import {breakpoints, flexColumn, marginsCenter, standardValues} from "../StyledGlobal";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
const Styled = styled.div`
  width: 100%;
  ${flexColumn};
  margin-top: ${standardValues.marginSmall};
  .show-more {
    display: flex;
    justify-content: center;
    margin-bottom: ${standardValues.marginSmall};
    button {
      width: ${standardValues.freeButtonWidth};
    }
  }
  .pagination {
    ${marginsCenter};
    li {
      background-color: transparent;
    }
    * {
      color: ${({theme}) => theme.colors.main};
      background-color: ${({theme}) => theme.colors.extraLightColor};
      border-color: ${({theme}) => theme.colors.lightColor};
    }
    .page-item + .active {
      > span {
        background-color: ${({theme}) => theme.colors.main};
        color: ${({theme}) => theme.colors.extraLightColor};
        border-color: ${({theme}) => theme.colors.main};
      }
    }
    .page-item {
      &:first-child {
        > span {
          > span {
            color: gray;
          }
        }
      }
    }
    .page-item + .disabled {
      span {
        color: gray;
      }
    }
  }
`

const CustomPagination = observer(() => {
    const theme = useTheme();
    const width = useWindowSize();
    const paginationLimits = {
        small: 5,
        middle: 7,
        large: 9
    }
    const {item} = useContext(Context);
    const [pagesAmount, setPagesAmount] = useState(1);
    const clickPage = (val) => {
        item.setPage(val);
        item.fetchItems(val);
    }
    let paginationLimit = paginationLimits.large;
    if (width < breakpoints.rawSmall) {
        paginationLimit = paginationLimits.small
    }
    else if (width >= breakpoints.rawFromSmall && width < breakpoints.rawLarge) {
        paginationLimit = paginationLimits.middle
    }
    const offset = Math.floor( paginationLimit/2);
    let [start, end] = [1, pagesAmount];
    if (pagesAmount > paginationLimit) {
        if (item.page - offset < 1) {
           end = item.page + offset + (offset - item.page) + 1;
        }
        else if (item.page + offset > pagesAmount) {
            start = item.page - offset - ((item.page + offset) - pagesAmount)
        }
        else {
            start = item.page - offset;
            end = item.page + offset
        }
    }
    let pages = [];
    for (let i= start; i<=end; i++) {
        pages.push(<Pagination.Item active={item.page === i} key={i} onClick={() => {
            clickPage(i);
        }}>{i}</Pagination.Item>)
    }
    useEffect(() => {
            setPagesAmount(Math.ceil(item.count/item.limit));
    }, [item.count, item.limit]);
    return (<>
            {pagesAmount > 1 ? <Styled>
                {item.page === 1 && <div className={'show-more'}>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={() => {
                        item.setItems(null);
                        item.setLimit(item.limit * 2);
                        item.fetchItems();
                    }}>Показывать больше</Button>
                </div>}
                <Pagination size={paginationLimit === paginationLimits.small ? 'sm' : ''}>
                    <Pagination.First onClick={() => clickPage(1)} disabled={item.page === 1}/>
                    <Pagination.Prev disabled={item.page === 1} onClick={() => clickPage(item.page - 1)}/>
                    {pages}
                    <Pagination.Next disabled={item.page === pagesAmount} onClick={() => clickPage(item.page + 1)}/>
                    <Pagination.Last onClick={() => clickPage(pagesAmount)} disabled={item.page === pagesAmount}/>
                </Pagination>
            </Styled> : <></>}
    </>
    );
});

export default CustomPagination;