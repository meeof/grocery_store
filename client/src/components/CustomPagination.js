import React from 'react';
import {Pagination} from "react-bootstrap";
import styled from "styled-components";
import useWindowSize from "../hooks/useWindowSize";
import {colors, marginsCenter, marginSmall} from "../StyledGlobal";
const Styled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: ${marginSmall};;
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

const CustomPagination = ({pagesAmount, page, clickPage}) => {
    const limits = {
        small: 5,
        middle: 7,
        large: 9
    }
    const width = useWindowSize();
    let limit = limits.large;
    if (width < 576) {
        limit = limits.small
    }
    else if (width >= 576 && width < 992) {
        limit = limits.middle
    }
    const offset = Math.floor( limit/2);
    let pages = [];
    let [start, end] = [1, pagesAmount];
    if (pagesAmount > limit) {
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
    return (
        <Styled>
            <Pagination size={limit === limits.small ? 'sm' : ''}>
                <Pagination.First onClick={() => clickPage(1)} disabled={page === 1}/>
                <Pagination.Prev disabled={page === 1} onClick={() => clickPage(page - 1)}/>
                {pages}
                <Pagination.Next disabled={page === pagesAmount} onClick={() => clickPage(page + 1)}/>
                <Pagination.Last onClick={() => clickPage(pagesAmount)} disabled={page === pagesAmount}/>
            </Pagination>
        </Styled>
    );
};

export default CustomPagination;