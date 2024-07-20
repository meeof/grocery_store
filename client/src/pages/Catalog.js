import React, {useContext, useEffect} from 'react';
import styled, {useTheme} from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import CategoryCard from "../components/cards/CategoryCard";
import {Button} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {API, authAPI, authorization} from "../api";
import {
    breakpoints,
    customGrid,
    flexColumn,
    marginsPage,
    standardValues
} from "../StyledGlobal";
import Load from "../components/Load";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import useWindowSize from "../hooks/useWindowSize";

const Styled = styled.div`
  ${flexColumn};
  ${marginsPage};
  .view-all-button {
    width: ${standardValues.freeButtonWidth};
    align-self: center;
    margin-bottom: ${standardValues.marginSmall};
    margin-top: ${standardValues.marginSmall};
    @media (${breakpoints.small}) {
      width: 100%;
    }
  }
  .card-container {
    ${customGrid};
  }
  .category-transition-enter {
    opacity: 0;
  }
  .category-transition-enter-active {
    opacity: 1;
    transition: opacity 500ms ease-in;
  }
  .category-transition-exit {
    transform: translate(0);
  }
  .category-transition-exit-active {
    transform: translate(${props => -props.$width + 'px'}, ${props => -props.$width + 'px'});
    transition-duration: 800ms;
    transition-timing-function: ease-in;
  }
`

const Catalog = observer( () => {
    const width = useWindowSize();
    const theme = useTheme();
    const {item, category, user} = useContext(Context);
    const navigate = useNavigate();
    const {categoryId} = useParams();
    const delCategory = (id) => {
        authAPI('delete', '/api/categories', {id}).then((data) => {
            if (data === 'Unauthorized') {
                return
            }
            API('get', '/api/categories').then(data => {
                category.setCategories(data);
            });
        }).catch(err => {
            console.log(err.response.data);
        })
    };
    const handlerShowAll = () => {
        item.setItems(null);
        item.setPage(1);
        item.setFind('');
        navigate(`all`);
    }
    useEffect(() => {
        if (!category.categories) {
            if (!user.isAuth) {
                authorization().then(data => {
                    user.setAuth(data);
                }).catch(() => {
                    user.setAuth(false);
                })
            }
            API('get', '/api/categories').then(data => {
                category.setCategories(data);
            });
        }
    }, [category, user]);
    return (
        <>
            {category.categories ? <Styled $width={width}>
                {!categoryId && <Button variant={theme.colors.bootstrapMainVariant} className={'view-all-button'}
                                        onClick={handlerShowAll}
                >Показать все</Button>}
                    <TransitionGroup className={'card-container'}>
                        {category.categories.map(category => {
                            return <CSSTransition
                                key={category.id}
                                timeout={500}
                                classNames="category-transition"
                            >
                                <CategoryCard delCategory={delCategory} img={category.image}
                                              creator={category.userId} name={category.name} id={category.id} isAuth={user.isAuth}/>
                            </CSSTransition>
                        })}
                    </TransitionGroup>
            </Styled> : <Load/>}
        </>
    );
});

export default Catalog;