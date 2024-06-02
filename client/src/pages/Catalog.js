import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import CategoryCard from "../components/cards/CategoryCard";
import {Button} from "react-bootstrap";
import {Context} from "../index";
import {observer} from "mobx-react-lite";
import {API, authAPI, authorization} from "../api";
import {breakpoints, colors, customGrid, flexColumn, freeButtonWidth, marginSmall, marginsPage} from "../StyledGlobal";

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
    const {item} = useContext(Context);
    const {user} = useContext(Context);
    useEffect(() => {
        API('get', '/api/categories').then(data => {
            item.setCategories(data);
        });
        authorization().then(data => {
            user.setAuth(data);
        }).catch(err => {
            user.setAuth(false);
        })
    }, [item, user]);
    const delCategory = (id) => {
        authAPI('delete', '/api/categories', {id}).then((data) => {
            API('get', '/api/categories').then(data => {
                item.setCategories(data);
            });
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    const navigate = useNavigate();
    let {categoryId} = useParams();
    let cards  = item.categories?.map(category => {
            return <CategoryCard key={category.id} delCategory={delCategory}
                                 img={category.image} name={category.name} id={category.id} isAuth={user.isAuth} />
        });
    const handlerShowAll = () => {
        item.setFind('');
        navigate(`all`)
    }
    return (
        <Styled>
            {!categoryId && <Button variant={colors.bootstrapMainVariant} className={'view-all-button'}
                                    onClick={handlerShowAll}
            >Показать все</Button>}
            <div className={'card_container'}>
                {cards}
            </div>
        </Styled>
    );
});

export default Catalog;