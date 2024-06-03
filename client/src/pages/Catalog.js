import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import CategoryCard from "../components/cards/CategoryCard";
import {Button} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {API, authAPI, authorization} from "../api";
import {breakpoints, colors, customGrid, flexColumn, freeButtonWidth, marginSmall, marginsPage} from "../StyledGlobal";
import Load from "../components/Load";

const Styled = styled.div`
  ${flexColumn};
  ${marginsPage};
  .view-all-button {
    width: ${freeButtonWidth};
    align-self: center;
    margin-bottom: ${marginSmall};
    margin-top: ${marginSmall};
    @media (${breakpoints.small}) {
      width: 100%;
    }
  }
  .card_container {
    ${customGrid};
  }
`

const Catalog = observer( () => {
    const {item, category, user} = useContext(Context);
    const navigate = useNavigate();
    const {categoryId} = useParams();
    const delCategory = (id) => {
        authAPI('delete', '/api/categories', {id}).then(() => {
            API('get', '/api/categories').then(data => {
                category.setCategories(data);
            });
        }).catch(err => {
            console.log(err.response.data);
        })
    };
    const handlerShowAll = () => {
        item.setItems(null);
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
                }).finally(() => {
                    API('get', '/api/categories').then(data => {
                        category.setCategories(data);
                    });
                })
            }
            else {
                API('get', '/api/categories').then(data => {
                    category.setCategories(data);
                });
            }
        }
    }, [category, user]);
    return (
        <>
            {category.categories ? <Styled>
                {!categoryId && <Button variant={colors.bootstrapMainVariant} className={'view-all-button'}
                                        onClick={handlerShowAll}
                >Показать все</Button>}
                <div className={'card_container'}>
                    {category.categories.map(category => {
                        return <CategoryCard key={category.id} delCategory={delCategory}
                                             img={category.image} name={category.name} id={category.id} isAuth={user.isAuth}/>
                    })}
                </div>
            </Styled> : <Load/>}
        </>
    );
});

export default Catalog;