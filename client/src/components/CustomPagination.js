import React, {useContext, useEffect, useState} from 'react';
import {Button, Pagination} from "react-bootstrap";
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import {colors, flexColumn, freeButtonWidth, marginsCenter, marginSmall} from "../StyledGlobal";
import {observer} from "mobx-react-lite";
import {Context} from "../index";
const Styled = styled.div`
  width: 100%;
  ${flexColumn};
  margin-top: ${marginSmall};
  .show-more {
    display: flex;
    justify-content: center;
    margin-bottom: ${marginSmall};
    button {
      width: ${freeButtonWidth};
    }
  }
  .pagination {
    ${marginsCenter};
    * {
      color: ${colors.main};
    }
    .page-item + .active {
      > span {
        background-color: ${colors.main};
        color: white;
        border-color: ${colors.main};
      }
    }
  }
`

const CustomPagination = observer(({fetchItems}) => {
    const paginationLimits = {
        small: 5,
        middle: 7,
        large: 9
    }
    const {item} = useContext(Context);
    const [page, setPage] = useState(1);
    const [pagesAmount, setPagesAmount] = useState(1);
    const clickPage = (val) => {
        setPage(val);
        fetchItems(val, item.limit)
    }
    const width = useWindowSize();
    let paginationLimit = paginationLimits.large;
    if (width < 576) {
        paginationLimit = paginationLimits.small
    }
    else if (width >= 576 && width < 992) {
        paginationLimit = paginationLimits.middle
    }
    const offset = Math.floor( paginationLimit/2);
    let pages = [];
    let [start, end] = [1, pagesAmount];
    if (pagesAmount > paginationLimit) {
        if (page - offset < 1) {
           end = page + offset + (offset - page) + 1
        }
        else if (page + offset > pagesAmount) {
            start = page - offset - ((page + offset) - pagesAmount)
        }
        else {
            start = page - offset;
            end = page + offset
        }
    }
    for (let i= start; i<=end; i++) {
        pages.push(<Pagination.Item active={page === i} key={i} onClick={() => {
            clickPage(i);
        }}>{i}</Pagination.Item>)
    }
    useEffect(() => {
        setPagesAmount(Math.ceil(item.count/item.limit));
    }, [item.count, item.limit]);
    return (<>
            {pagesAmount > 1 ? <Styled>
                {page === 1 && <div className={'show-more'}>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => {
                        fetchItems(1, item.limit * 2);
                        item.setLimit(item.limit * 2);
                    }}>Показывать больше</Button>
                </div>}
                <Pagination size={paginationLimit === paginationLimits.small ? 'sm' : ''}>
                    <Pagination.First onClick={() => clickPage(1)} disabled={page === 1}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => clickPage(page - 1)}/>
                    {pages}
                    <Pagination.Next disabled={page === pagesAmount} onClick={() => clickPage(page + 1)}/>
                    <Pagination.Last onClick={() => clickPage(pagesAmount)} disabled={page === pagesAmount}/>
                </Pagination>
            </Styled> : <></>}
    </>
    );
});

export default CustomPagination;