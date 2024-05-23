import React, {useContext, useState} from 'react';
import styled from "styled-components";
import noImage from "../assets/free-icon-font-copy-image-9291618.svg";
import {Accordion, Button, Carousel, Image, Modal} from "react-bootstrap";
import ViewProfileUser from "./miniComponents/ViewProfileUser";
import UpdateButton from "./miniComponents/UpdateButton";
import DelButton from "./miniComponents/DelButton";
import {deleteReview, updateReview} from "../http/basketAPI";
import {Context} from "../index";
const Styled = styled.div`
    display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  .review-card-head {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    > i {
      justify-self: flex-end;
      margin-left: auto;
    }
    .review-card-profile-image {
      width: 50px;
      height: 50px;
      margin-right: 20px;
      cursor: pointer;
    }
  }
  .review-card-body {
    .accordion-button {
      margin: 0;
    }
    .review-text {
      padding: 20px;
    }
    .review-image {
      width: 100%;
      border: solid lightgray 1px;
      border-radius: 5px;
      cursor: pointer;
    }
    .accordion-body {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }
  }
`

const ReviewCard = ({reviewObj, userId}) => {
    const {user} = useContext(Context);
    const [index, setIndex] = useState(0);
    let [review, setReview] = useState(reviewObj.review);
    const [redactImages, setRedactImages] = useState([]);
    let myReview = false;
    if (userId === reviewObj.userId) {
        myReview = true;
    }
    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };
    const [showModal, setShowModal] = useState(false);
    const handleModal = (value) => {
        setShowModal(value);
    }
    function handlerTextArea(e) {
        setReview(e.target.value);
    }
    const [showImages, setShowImages] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const updated = new Date(reviewObj.updatedAt);
    const localeStringOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    let images = [];
    let slides = []
    if (reviewObj.images) {
        reviewObj.images.forEach((image, index) => {
            images.push(<Image className={'review-image'} key={`${index}_${image}`} alt={''}
                               src={process.env.REACT_APP_API_URL + image}
                               onClick={() => {
                                   setShowImages(true);
                                   handleSelect(index);
                               }}/>);
            slides.push(<Carousel.Item key={`slide_${index}_${image}`}>
                <Image src={process.env.REACT_APP_API_URL + image} style={{width: '100%'}}/>
            </Carousel.Item>)
        })
    }
    const handlerDeleteReview = (id) => {
        deleteReview(id).then(data => {
            user.forceUpdate();
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleCancel = () => {
        setReview(reviewObj.review);
        setRedactImages([]);
        setShowModal(false);
    }
    const handleUpdateReview = () => {
        const formData = new FormData();
        formData.append('id', reviewObj.id);
        review && formData.append('review', review);
        for (const [key, value] of Object.entries(redactImages)) {
            formData.append(`${key}_${value.name}`, value)
        }
        updateReview(formData).then(data => {
            user.forceUpdate();
            handleCancel();
        }).catch((err) => {
            console.log(err);
        })
    }
    return (
        <Styled>
            <div className={'review-card-head'}>
                <Image src={reviewObj.img ? process.env.REACT_APP_API_URL + reviewObj.img : noImage}
                       roundedCircle className={'review-card-profile-image'} onClick={() => setShowUser(true)}/>
                <h5>{reviewObj.name} {reviewObj.surname}</h5>
                <i>{reviewObj.createdAt !== reviewObj.updatedAt ? 'Изм.' : ''} {updated.toLocaleString("eu", localeStringOptions)}</i>
                {myReview && <UpdateButton top={'20px'} handleModal={handleModal}/>}
                {myReview && <DelButton delFun={handlerDeleteReview} id={reviewObj.id} name={'отзыв'} top={'20px'}/>}
            </div>
            <div className={'review-card-body'}>
                <div className={'review-text'}>{reviewObj.review}</div>
                {images.length > 0 && <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Изображения</Accordion.Header>
                        <Accordion.Body>
                            {images}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>}
            </div>
            <Modal
                show={showImages}
                onHide={() => setShowImages(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton/>
                <Modal.Body>
                    <Carousel variant={"dark"} activeIndex={index} onSelect={handleSelect} interval={null}>
                        {slides}
                    </Carousel>
                </Modal.Body>
            </Modal>
            <ViewProfileUser name={reviewObj.name} surname={reviewObj.surname} about={reviewObj.about} status={reviewObj.status}
                image={reviewObj.img} showUser={showUser} setShowUser={setShowUser}/>
            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование отзыва</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: "flex", flexDirection: "column"}}>
                    <textarea autoFocus={true} className="redactComRevArea" placeholder={`Напишите отзыв ...`}
                              value={review} onChange={(e)=> handlerTextArea(e)}
                              style={{marginBottom: '20px', minHeight: '100px'}}
                    ></textarea>
                    <input id={'reviewFileInput'} multiple type="file" accept="image/*" onChange={(event) => {
                        setRedactImages(event.target.files);
                    }}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Отменить
                    </Button>
                    <Button variant="success" onClick={handleUpdateReview}>Редактировать</Button>
                </Modal.Footer>
            </Modal>
        </Styled>
    );
};

export default ReviewCard;