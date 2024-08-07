import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import styled, {useTheme} from "styled-components";
import Load from "../components/Load";
import {observer} from "mobx-react-lite";
import PublicationCard from "../components/cards/PublicationCard";
import {flexColumn, marginsCenter, standardValues} from "../StyledGlobal";
import {Button} from "react-bootstrap";
import {authAPI} from "../api";

const Styled = styled.div`
  ${flexColumn}
  .publications-box {
    ${flexColumn}
  }
  .show-more {
    ${marginsCenter}
  }
  > {
    button {
      margin-bottom: ${standardValues.marginSmall};
    }
  }
`;

const Blog = observer (() => {
    const theme = useTheme();
    const {blog, user, scroll} = useContext(Context);
    const deletePublication = (id) => {
        authAPI('delete','/api/blog', {id}).then(data => {
            if (data === 'Unauthorized') {
                return
            }
            blog.setBlog(null);
            blog.fetch();
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        blog.fetch(() => scroll.scrollToPoint());
    }, [blog, scroll]);
    return (
        <Styled>
            {blog.blog ? <>{blog.blog.length !== 0 ? <>
                        <div className={'publications-box'}>
                            {blog.blog.map(publication => {
                                return <PublicationCard delFun={deletePublication} key={publication.id} publication={publication} isAuth={user.isAuth}/>
                            })}
                        </div>
                        {blog.count > blog.limit && <Button variant={theme.colors.bootstrapMainVariant} className={'show-more'}
                                                             onClick={(e) => {
                                                                 scroll.setScroll();
                                                                 blog.setLimit(blog.limit * 2);
                                                                 blog.setBlog(0);
                                                                 blog.fetch(() => scroll.scrollToPoint())
                                                             }}>Показывать больше</Button>}
                    </>
                    :
                    <h2>Новости скоро появятся</h2>}</> :
                <Load/>}
        </Styled>
    );
});

export default Blog;