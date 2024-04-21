import React from 'react';
import styled from "styled-components";
import {Button} from "react-bootstrap";
const Styled = styled.div`
  margin: 24px;
  @media (max-width: 575.5px) {
    margin: 8px;
  }
  button {
    margin-top: 15px;
  }
`

const Reviews = () => {
    return (
        <Styled>
            <h2>Отзывы</h2>
            <div>Отзывов еще никто не оставлял</div>
            <Button variant="success">Написать отзыв</Button>
        </Styled>
    );
};

export default Reviews;