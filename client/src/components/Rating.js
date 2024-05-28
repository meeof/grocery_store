import React, {useContext, useEffect, useState} from 'react';
import starImg from '../assets/icon_star.svg';
import starImgFill from '../assets/icon_star_black.svg';
import styled from "styled-components";
import {authAPI} from "../api/userAPI";
import {Context} from "../index";
import {getRating, getRatingForUser, setRatings} from "../api/ratingApi";
const Styled = styled.div`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  width: ${(props) => (props.$disabled ? "min-content" : "100%")};
  justify-content: ${(props) => (props.$disabled ? "flex-start" : "space-evenly")};
  span {
    vertical-align: center;
    font-weight: bold;
  }
  img {
    width: ${(props) => (props.$big ? "32px" : "16px")};
    margin-right: 4px;
  }
`

const Rating = ({disabled, big, itemsId}) => {
    const {user} = useContext(Context);
    const [rating, setRating] = useState(0);
    useEffect(() => {
        if (big) {
            return
        }
        if (disabled) {
            getRating(itemsId[0]).then(data => {
                setRating(data);
            }).catch((err) => {
                console.log(err);
            });
        }
        else  {
            getRatingForUser(itemsId[0], user.isAuth.id).then(data => {
                setRating(data);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [big, itemsId, user.isAuth.id, disabled]);
    useEffect(() => {
        authAPI().then(data => {
            user.setAuth(data);
        }).catch((err) => {
            user.setAuth(false);
        })
    }, [user]);
    const handleSetRating = (rate) => {
        setRatings({rate, userId: user.isAuth.id, itemsId}).then(data => {

        }).catch(err => {
            console.log(err);
        })
    }
    let imgStars = [];
    for (let i=0; i < 5; i++) {
        imgStars.push(<img key={i} alt={'star'} src={i < rating ? starImgFill : starImg} onClick={() => {
            if (disabled) {
                return
            }
            handleSetRating(i + 1)
        }}/>)
    }
    return (
        <Styled $disabled={disabled} $big={big}>
            {imgStars}
            {disabled && <span>{rating}</span>}
        </Styled>
    );
};

export default Rating;