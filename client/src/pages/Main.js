import React, {useContext, useEffect} from 'react';
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
    useEffect(() => {
        blog.fetch(null, true);
    }, [blog]);
    return (
        <Styled>
            <MainSlider/>
            {blog.blog?.[0] && <PublicationCard one={true} publication={blog.blog[0]} isAuth={user.isAuth}/>}
            <CardBar field={'new'}/>
        </Styled>
    );
});

export default Main;