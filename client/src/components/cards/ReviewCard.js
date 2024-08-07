import React, {useContext, useState} from 'react';
import styled, {useTheme} from "styled-components";
import noImage from "../../assets/icon-picture.svg";
import {Accordion, Button, Carousel, Form, Image, Modal} from "react-bootstrap";
import ViewUser from "../modals/ViewUser";
import UpdateButton from "../buttons/UpdateButton";
import DelButton from "../buttons/DelButton";
import {Context} from "../../index";
import {staticColors, flexColumn, standardValues, Theme} from "../../StyledGlobal";
import {authAPI} from "../../api";
import {dateString} from "../../usefulFunctions";
const Styled = styled.div`
    ${flexColumn};
  margin-bottom: ${standardValues.marginMedium};
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
      margin-right: ${standardValues.marginMedium};
      cursor: pointer;
    }
  }
  .review-card-body {
    .accordion-button {
      margin: 0;
    }
    .review-text {
      padding: ${standardValues.marginMedium};
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

const ReviewCard = ({reviewObj, myReview, handlerAddUpdate}) => {
    const theme = useTheme();
    const {render} = useContext(Context);
    const [review, setReview] = useState(reviewObj.review);
    const [redactImages, setRedactImages] = useState([]);
    const [showRedact, setShowRedact] = useState(false);
    const [showUser, setShowUser] = useState(false);
    const [showImages, setShowImages] = useState(false);
    const [imageIndex, setImageIndex] = useState(0);
    const handleSelectImage = (selectedIndex) => {
        setImageIndex(selectedIndex);
    };
    const created = dateString(reviewObj.createdAt);
    let images = [];
    let slides = [];
    if (reviewObj.images) {
        reviewObj.images.forEach((image, index) => {
            images.push(<Image className={'review-image'} key={`${index}_${image}`} alt={''}
                               src={process.env.REACT_APP_API_URL + image}
                               onClick={() => {
                                   setShowImages(true);
                                   handleSelectImage(index);
                               }}/>);
            slides.push(<Carousel.Item key={`slide_${index}_${image}`}>
                <Image src={process.env.REACT_APP_API_URL + image} style={{width: '100%'}}/>
            </Carousel.Item>)
        })
    }
    const handlerDeleteReview = (id) => {
        authAPI( 'delete', '/api/reviews', {id}).then(data => {
            if (data === 'Unauthorized') {
                return
            }
            render.forceUpdate();
        }).catch((err) => {
            console.log(err);
        })
    }
    const handleCancel = () => {
        setReview(reviewObj.review);
        setRedactImages([]);
        setShowRedact(false);
    }
    return (
        <>
            <Styled>
                <div className={'review-card-head'}>
                    <Image src={reviewObj.img ? process.env.REACT_APP_API_URL + reviewObj.img : noImage}
                           roundedCircle className={'review-card-profile-image'} onClick={() => setShowUser(true)}/>
                    <h5>{reviewObj.name} {reviewObj.surname}</h5>
                    <i>{reviewObj.createdAt !== reviewObj.updatedAt ? 'Изм.' : ''} {created}</i>
                    {myReview && <UpdateButton right={'40px'} top={'20px'} handleModal={setShowRedact}/>}
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
            </Styled>
            <ViewUser name={reviewObj.name} surname={reviewObj.surname} about={reviewObj.about} status={reviewObj.status}
                      image={reviewObj.img} showUser={showUser} setShowUser={setShowUser} profileCreated={reviewObj.profileCreated}/>
            <Modal
                show={showRedact}
                onHide={() => setShowRedact(false)}
                backdrop="static"
                keyboard={false}
                data-bs-theme={Theme.dark ? "dark" : "light"}
                style={{color: theme.colors.textColor}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование отзыва</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{display: "flex", flexDirection: "column"}}>
                    <Form.Control as={"textarea"} autoFocus={true} className="redactReviewArea" placeholder={`Напишите отзыв ...`}
                              value={review} onChange={(e)=> setReview(e.target.value)}
                              style={{marginBottom: '20px', minHeight: '100px'}}/>
                    <Form.Control id={'reviewFileInput'} multiple type="file" accept="image/*" onChange={(event) => {
                        setRedactImages(event.target.files);
                    }}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel} style={{color: theme.colors.btnTextColor}}>
                        Отменить
                    </Button>
                    <Button variant={theme.colors.bootstrapMainVariant} style={{color: theme.colors.btnTextColor}} onClick={() => {
                        handlerAddUpdate(review, redactImages, reviewObj.id, () => {
                            setRedactImages([]);
                            setShowRedact(false);
                        })
                    }}>
                        Редактировать
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal
                show={showImages}
                onHide={() => setShowImages(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton/>
                <Modal.Body>
                    <Carousel variant={staticColors.bootstrapOtherVariant} activeIndex={imageIndex} onSelect={handleSelectImage} interval={null}>
                        {slides}
                    </Carousel>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ReviewCard;