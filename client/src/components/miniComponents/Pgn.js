import React from 'react';
import {Pagination} from "react-bootstrap";
import styled from "styled-components";
const Styled = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  .pagination {
    margin-left: auto;
    margin-right: auto;
    * {
      color: #1f7d63;
    }
    .page-item + .active {
      > span {
        background-color: #1f7d63;
        color: white;
        border-color: #1f7d63;
      }
    }
  }
`

const Pgn = ({count, limit}) => {
    return (
        <Styled>
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item>{14}</Pagination.Item>
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </Styled>
    );
};

export default Pgn;