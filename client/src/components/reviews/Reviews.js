import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import AddReview from "./AddReview";
import ReviewCard from "../cards/ReviewCard";
import {marginMedium, marginsPage} from "../../StyledGlobal";
import {API, authAPI} from "../../api";
import Load from "../Load";
import {addImagesToFormData} from "../../usefulFunctions";
const Styled = styled.div`
  position: relative;
  ${marginsPage};
  margin-bottom: ${marginMedium};
  button {
    margin-top: ${marginMedium};
  }
`

const Reviews = observer(({itemId}) => {
    const {user, review, render} = useContext(Context);
    const handlerAddUpdate = (text, images, id, then) => {
        let formData = new FormData();
        if (id) {
            formData.append('id', id);
        }
        else {
            formData.append('userId', user.isAuth.id);
            formData.append('itemId', itemId);
        }
        text && formData.append('review', text);
        images && (formData = addImagesToFormData(formData, images));
        authAPI('post', '/api/reviews', formData).then(() => {
            then && then();
            render.forceUpdate();
        }).catch((err) => {
            console.log(err);
        })
    }
    useEffect(() => {
        authAPI('get', '/api/reviews/check', {itemId, field: 'bought'}).then(data => {
            review.setBought(data);
            authAPI('get', '/api/reviews/check', {itemId, field: 'reviewed'}).then(data => {
                review.setReviewed(data)
            }).catch(err => {
                console.log(err);
            });
        }).catch(err => {
            console.log(err);
        });
        API('get', '/api/reviews', {itemId}).then(data => {
            review.setReviews(data);
        }).catch((err) => {
            console.log(err);
        })
    }, [review, user, render.rerender, itemId]);
    return (
        <Styled>
            {(review.bought && !review.reviewed) && <AddReview handlerAddUpdate={handlerAddUpdate}/>}
            {review.reviews ? <>{review.reviews.length > 0 ?
                review.reviews.map(obj => {
                    return <ReviewCard key={obj.id} reviewObj={obj} handlerAddUpdate={handlerAddUpdate}
                                       myReview={(user.isAuth.role === 'ADMIN' || user.isAuth.id === obj.userId)}/>
                }) : <>
                    <h2>Отзывы</h2>
                    <div>Отзывов еще никто не оставлял</div>
                </>}
            </> : <Load/>}
        </Styled>
    );
});

export default Reviews;