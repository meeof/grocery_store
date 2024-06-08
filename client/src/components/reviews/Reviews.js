import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import AddReview from "./AddReview";
import ReviewCard from "../cards/ReviewCard";
import {marginMedium, marginsPage} from "../../StyledGlobal";
import {API, authAPI} from "../../api";
import Load from "../Load";
const Styled = styled.div`
  ${marginsPage};
  margin-bottom: ${marginMedium};
  button {
    margin-top: ${marginMedium};
  }
`

const Reviews = observer(({itemId}) => {
    const {user, review, render} = useContext(Context);
    useEffect(() => {
        user.checkAuthUser(() => {
            authAPI('get', '/api/basket/bought', {userId: user.isAuth.id, itemId}).then(data => {
                review.setBought(data);
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                authAPI('get', '/api/basket/reviewed', {userId: user.isAuth.id, itemId}).then(data => {
                    review.setReviewed(data);
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    API('get', '/api/basket/reviews', {itemId}).then(data => {
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
                    return <ReviewCard key={obj.id} reviewObj={obj} myReview={user.isAuth.id === obj.userId}/>
                }) : <>
                    <h2>Отзывы</h2>
                    <div>Отзывов еще никто не оставлял</div>
                </>}
            </> : <Load/>}
            {(review.bought && !review.reviewed) && <AddReview userId={user.isAuth.id} itemId={itemId}/>}
        </Styled>
    );
});

export default Reviews;