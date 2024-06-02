import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";
import AddReview from "./AddReview";
import ReviewCard from "../cards/ReviewCard";
import {marginMedium, marginsPage} from "../../StyledGlobal";
import {API, authAPI, authorization} from "../../api";
const Styled = styled.div`
  ${marginsPage};
  margin-bottom: ${marginMedium};
  button {
    margin-top: ${marginMedium};
  }
`

const Reviews = observer(({itemId}) => {
    const {user} = useContext(Context);
    const [wasBought, setWasBought] = useState(false);
    const [wasReviewed, setWasReviewed] = useState(false);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        authorization().then(data => {
            user.setAuth(data);
            authAPI('get', '/api/basket/bought', {userId: user.isAuth.id, itemId}).then(data => {
                setWasBought(data);
            }).catch(err => {
                console.log(err);
            });
            authAPI('get', '/api/basket/reviewed', {userId: user.isAuth.id, itemId}).then(data => {
                setWasReviewed(data);
            }).catch(err => {
                console.log(err);
            })
        }).catch((err) => {
            user.setAuth(false);
        })
    }, [user, itemId, wasBought, user.rerender]);
    useEffect(() => {
        if (itemId) {
            API('get', '/api/basket/reviews', {itemId}).then(data => {
                setReviews(data)
            }).catch((err) => {
                console.log(err);
            })
        }
    }, [itemId, user.rerender]);
    const reviewsElements = reviews.map(obj => {
        return <ReviewCard key={obj.id} reviewObj={obj} userId={user.isAuth.id}/>
    })
    return (
        <Styled>
            {reviewsElements.length > 0 ?
                reviewsElements : <>
                    <h2>Отзывы</h2>
                    <div>Отзывов еще никто не оставлял</div>
                </>}
            {(wasBought && !wasReviewed) && <AddReview userId={user.isAuth.id} itemId={itemId}/>}
        </Styled>
    );
});

export default Reviews;