import React, {useContext, useEffect, useState} from 'react';
import styled from "styled-components";
import {authAPI} from "../http/userAPI";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {bought, fetchReviews, reviewed} from "../http/itemAPI";
import AddReview from "./AddReview";
import ReviewCard from "./ReviewCard";
const Styled = styled.div`
  margin: 24px;
  @media (max-width: 575.5px) {
    margin: 8px;
  }
  button {
    margin-top: 15px;
  }
`

const Reviews = observer(({itemId}) => {
    const {user} = useContext(Context);
    const [wasBought, setWasBought] = useState(false);
    const [wasReviewed, setWasReviewed] = useState(false);
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
            bought(user.isAuth.id, itemId).then(data => {
                setWasBought(data);
            }).catch(err => {
                console.log(err);
            });
            reviewed(user.isAuth.id, itemId).then(data => {
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
            fetchReviews(itemId).then(data => {
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