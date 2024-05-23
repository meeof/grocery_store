import styled from "styled-components";
import React, {useContext, useState} from "react";
import {Button, CloseButton} from "react-bootstrap";
import useWindowSize from "../hooks/useWindowSize";
import AddImagesButton from "./miniComponents/AddImagesButton";
import {addReview} from "../http/itemAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

let Styled = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
  .btn-close {
    padding: 0;
    background-size: 30px;
    height: 30px;
    width: 30px;
    margin-left: 40px;
  }
  .review-button-block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    > {
      &:first-child {
        width: 100%;
      }
    }
  }
  button {
    margin: 0;
  }
  > textarea {
    min-height: 120px;
  }
  @media (max-width: 575.5px) {
    width: 100%;
  }
  @media (min-width: 576px) {
    width: 65%;
    margin-left: auto;
    margin-right: auto;
    .btn-close {
      position: absolute;
      top: 65px;
      right: 15px;
      cursor: pointer;
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
        addReview(formData).then(data => {
            setWrite(false);
            setImages([]);
            user.forceUpdate();
        }).catch((err) => {
            console.log(err);
        })
    }

    return <Styled>
        {write ? <div className={'review-button-block'}>
                <Button variant={"success"} onClick={()=> {
                    setReview('');
                    handlerAddReview();
                }}>Добавить отзыв</Button>
                {width < 576 && <CloseButton onClick={() => setWrite(false)}/>}
            </div>
            : <Button variant={"success"} onClick={()=> handlerWriteButton()}>Написать отзыв</Button>
        }
        {
            write ? <><textarea onFocus={(e) => {e.target.scrollIntoView()}}
                                autoFocus={true} className="addComRevArea" placeholder={`Напишите отзыв ...`}
                                value={review} onChange={(e)=> handlerTextArea(e)}></textarea>
                <AddImagesButton setImages={setImages} count={images?.length} big={width < 576}/>
                {width >= 576 && <CloseButton onClick={() => setWrite(false)}/>}</> : <></>
        }
    </Styled>
});
export default AddReview;