import React, {useContext, useEffect, useState} from 'react';
import lightStarImg from '../assets/light/icon_star.svg';
import darkStarImg from '../assets/dark/icon_star.svg';
import lightStarImgFill from '../assets/light/icon_star_fill.svg';
import darkStarImgFill from '../assets/dark/icon_star_fill.svg';
import styled from "styled-components";
import {Context} from "../index";
import {API, authAPI} from "../api";
import {useNavigate} from "react-router-dom";
import {Theme} from "../StyledGlobal";
const Styled = styled.div`
  display: flex;
  align-items: center;
  cursor: ${(props) => (props.$disabled ? "default" : "pointer")};
  width: ${(props) => (props.$disabled ? "min-content" : "100%")};
  justify-content: ${(props) => (props.$disabled ? "flex-start" : "space-evenly")};
  span {
    vertical-align: center;
    font-weight: bold;
    color: ${({theme}) => theme.colors.main};
  }
  img {
    width: ${(props) => (props.$big ? "32px" : "16px")};
    margin-right: 4px;
  }
`

const Rating = ({disabled, setShowModalAll, itemsId}) => {
    const navigate = useNavigate();
    const {user} = useContext(Context);
    const [rating, setRating] = useState(0);
    useEffect(() => {
        if (setShowModalAll) {
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
            authAPI('get', '/api/rating/user', {itemId: itemsId[0]}).then(data => {
                if (data === 'Unauthorized') {
                    return
                }
                setRating(data);
            }).catch((err) => {
                console.log(err);
            });
        }
    }, [setShowModalAll, itemsId, user.isAuth?.id, disabled]);
    const handleSetRating = (rate) => {
        authAPI('post', '/api/rating', {rate, itemsId}).then((data) => {
            if (data === 'Unauthorized') {
                navigate('/profile/login');
                return
            }
            if (!setShowModalAll) {
                setRating(rate);
            }
            else {
                setShowModalAll(false);
            }
        }).catch(err => {
            console.log(err);
            navigate('/profile/login');
        })
    }
    let imgStars = [];
    for (let i=0; i < 5; i++) {
        imgStars.push(<img key={i} alt={'star'} src={i < rating ?
            (Theme.dark ? darkStarImgFill : lightStarImgFill) :
            (Theme.dark ? darkStarImg : lightStarImg)} onClick={() => {
            if (disabled) {
                return
            }
            handleSetRating(i + 1)
        }}/>)
    }
    return (
        <Styled $disabled={disabled} $big={setShowModalAll}>
            {imgStars}
            {disabled && <span>{rating}</span>}
        </Styled>
    );
};

export default Rating;