import React, {useContext, useEffect, useState} from 'react';
import MainSlider from "../components/sliders/MainSlider";
import styled from "styled-components";
import {marginsPage} from "../StyledGlobal";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import PublicationCard from "../components/cards/PublicationCard";
import CardBar from "../components/CardBar";
const Styled = styled.div`
  ${marginsPage};
`

const Main = observer (() => {
    const {blog, user} = useContext(Context);
    const [newBar, setNewBar] = useState(<></>);
    const [discountBar, setDiscountBar] = useState(<></>);
    const [popularBar, setPopularBar] = useState(<></>);
    useEffect(() => {
        blog.fetch(null, true);
        setTimeout(() => {
            setNewBar(<CardBar field={'new'}/>);
            setDiscountBar(<CardBar field={'discount'}/>)
            setPopularBar(<CardBar field={'popular'}/>)
        }, 0)
    }, [blog]);
    return (
        <Styled>
            <h2>Новинки !</h2>
            {newBar}
            <MainSlider/>
            <h2>Выгодно !</h2>
            {discountBar}
            {blog.blog?.[0] && <PublicationCard one={true} publication={blog.blog[0]} isAuth={user.isAuth}/>}
            <h2>Популярные товары !</h2>
            {popularBar}
        </Styled>
    );
});

export default Main;