import styled from "styled-components";
import React, {useContext, useState} from "react";
import {Button, CloseButton} from "react-bootstrap";
import useWindowSize from "../../hooks/useWindowSize";
import AddImagesButton from "../buttons/AddImagesButton";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import {breakpoints, colors, flexColumn, iconsSize, marginsCenter} from "../../StyledGlobal";
import {authAPI} from "../../api";

let Styled = styled.div`
  ${flexColumn};
  position: relative;
  width: 65%;
  ${marginsCenter};
  .btn-close {
    padding: 0;
    background-size: ${iconsSize};
    height: ${iconsSize};
    min-width: ${iconsSize};;
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

const AddReview = observer(({userId, itemId}) => {
    const {user} = useContext(Context);
    let [write, setWrite] = useState(false);
    let [review, setReview] = useState('');
    const [images, setImages] = useState([]);
    const width = useWindowSize();
    function handlerWriteButton() {
        setWrite(true);
    }

    function handlerTextArea(e) {
        setReview(e.target.value);
    }

    function handlerAddReview() {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('itemId', itemId);
        review && formData.append('review', review);
        for (const [key, value] of Object.entries(images)) {
            formData.append(`${key}_${value.name}`, value)
        }
        authAPI('post', '/api/basket/review', formData).then(data => {
            setWrite(false);
            setImages([]);
            user.forceUpdate();
        }).catch((err) => {
            console.log(err);
        })
    }

    return <Styled>
        {write ? <div className={'review-button-block'}>
                <Button variant={colors.bootstrapMainVariant} onClick={()=> {
                    setReview('');
                    handlerAddReview();
                }}>Добавить отзыв</Button>
                {width < 576 && <CloseButton onClick={() => setWrite(false)}/>}
            </div>
            : <Button variant={colors.bootstrapMainVariant} onClick={()=> handlerWriteButton()}>Написать отзыв</Button>
        }
        {
            write ? <><textarea onFocus={(e) => {e.target.scrollIntoView()}}
                                autoFocus={true} className="addReviewArea" placeholder={`Напишите отзыв ...`}
                                value={review} onChange={(e)=> handlerTextArea(e)}></textarea>
                <AddImagesButton setImages={setImages} count={images?.length} big={width < 576}/>
                {width >= 576 && <CloseButton onClick={() => setWrite(false)}/>}</> : <></>
        }
    </Styled>
});
export default AddReview;