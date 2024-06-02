import React, {useContext, useEffect, useState} from 'react';
import starImg from '../assets/icon_star.svg';
import starImgFill from '../assets/icon_star_black.svg';
import styled from "styled-components";
import {Context} from "../index";
import {API, authAPI} from "../api";
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
            API('get', '/api/rating', {itemId: itemsId[0]}).then(data => {
                setRating(data);
            }).catch((err) => {
                console.log(err);
            });
        }
        else  {
            authAPI('get', '/api/rating/user', {itemId: itemsId[0], userId: user.isAuth.id}).then(data => {
                setRating(data);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [big, itemsId, user.isAuth.id, disabled]);
    const handleSetRating = (rate) => {
        authAPI('post', '/api/rating', {rate, userId: user.isAuth.id, itemsId}).then(data => {

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