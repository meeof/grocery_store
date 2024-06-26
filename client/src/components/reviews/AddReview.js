import styled, {useTheme} from "styled-components";
import React, {useState} from "react";
import {Button, CloseButton, Form} from "react-bootstrap";
import useWindowSize from "../../hooks/useWindowSize";
import AddImagesButton from "../buttons/AddImagesButton";
import {observer} from "mobx-react-lite";
import {breakpoints, flexColumn, marginsCenter, standardValues} from "../../StyledGlobal";

let Styled = styled.div`
  ${flexColumn};
  position: relative;
  width: 65%;
  ${marginsCenter};
  .btn-close {
    padding: 0;
    background-size: ${standardValues.iconsSize};
    height: ${standardValues.iconsSize};
    min-width: ${standardValues.iconsSize};;
    margin-left: 40px;
    position: absolute;
    top: 60px;
    right: 15px;
    cursor: pointer;
  }
  .review-button-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    > {
      &:first-child {
        width: 100%;
      }
    }
  }
  > textarea {
    min-height: 120px;
  }
  @media (${breakpoints.small}) {
    width: 100%;
    .btn-close {
      position: static;
    }
  }
`;

const AddReview = observer(({handlerAddUpdate}) => {
    const theme = useTheme();
    const width = useWindowSize();
    const [write, setWrite] = useState(false);
    const [review, setReview] = useState('');
    const [images, setImages] = useState([]);
    return <Styled>
        {write ? <div className={'review-button-block'}>
                <Button variant={theme.colors.bootstrapMainVariant} onClick={()=> {
                    setReview('');
                    handlerAddUpdate(review, images);
                }}>Добавить отзыв</Button>
                {width < breakpoints.rawSmall && <CloseButton onClick={() => setWrite(false)}/>}
            </div>
            : <Button variant={theme.colors.bootstrapMainVariant} onClick={()=> setWrite(true)}>Написать отзыв</Button>
        }
        {write && <><Form.Control as={"textarea"} onFocus={(e) => {e.target.scrollIntoView()}}
                              autoFocus={true} className="addReviewArea" placeholder={`Напишите отзыв ...`}
                              value={review} onChange={(e)=> setReview(e.target.value)}></Form.Control>
            <AddImagesButton setImages={setImages} count={images?.length} big={width < breakpoints.rawSmall}/>
            {width >= breakpoints.rawFromSmall && <CloseButton onClick={() => setWrite(false)}/>}</>}
    </Styled>
});
export default AddReview;