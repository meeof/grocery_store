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
        user.checkAuthUser(() => {
            review.check(user.isAuth.id, itemId, 'bought', (data) => review.setBought(data), () => {
                review.check(user.isAuth.id, itemId, 'reviewed',(data) => review.setReviewed(data), () => {
                    API('get', '/api/reviews', {itemId}).then(data => {
                        review.setReviews(data);
                    }).catch((err) => {
                        console.log(err);
                    })
                })
            })
        })
    }, [review, user, render.rerender, itemId]);
    return (
        <Styled>
            {review.reviews ? <>{review.reviews.length > 0 ?
                review.reviews.map(obj => {
                    return <ReviewCard key={obj.id} reviewObj={obj} myReview={user.isAuth.id === obj.userId}
                                       handlerAddUpdate={handlerAddUpdate}/>
                }) : <>
                    <h2>Отзывы</h2>
                    <div>Отзывов еще никто не оставлял</div>
                </>}
            </> : <Load/>}
            {(review.bought && !review.reviewed) && <AddReview handlerAddUpdate={handlerAddUpdate}/>}
        </Styled>
    );
});

export default Reviews;