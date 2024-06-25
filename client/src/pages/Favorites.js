import React, {useCallback, useContext, useEffect, useState} from 'react';
import styled, {useTheme} from "styled-components";
import {customGrid, flexColumn, marginsCenter, marginsPage, standardValues} from "../StyledGlobal";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {authAPI} from "../api";
import Load from "../components/Load";
import * as uf from "../usefulFunctions";
import ItemCard from "../components/cards/ItemCard";
import {Button} from "react-bootstrap";
const Styled = styled.div`
  ${flexColumn};
  ${marginsPage};
  .card_container {
    ${customGrid};
  }
  > {
    button {
      width: ${standardValues.freeButtonWidth};
      ${marginsCenter};
      margin-top: ${standardValues.marginSmall};
    }
  }
`

const Favorites = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const {user} = useContext(Context);
    const [favorites, setFavorites] = useState(null);
    const [count, setCount] = useState(0);
    const [limit, setLimit] = useState(6);
    const getFavorites = useCallback((limit) => {
        authAPI( 'get', '/api/favorites', {limit}).then((data) => {
            setFavorites(data.rows);
            setCount(data.count);
        }).catch(err => {
            console.log(err);
            navigate('/profile/login');
        })
    }, [navigate]);
    const delFavorites = (itemId) => {
        authAPI('delete', '/api/favorites', {itemId}).then(() => {
            getFavorites(limit);
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        if (!favorites) {
            getFavorites(limit)
        }
    }, [getFavorites, limit, favorites]);
    return (
        <Styled>{
            favorites ? <>
                    <div className={"card_container"}>{
                        favorites.length > 0 ? favorites.map(product => {
                            return <ItemCard key={uf.routePrefix('item', product.id)} delItem={delFavorites}
                                             isAuth={user.isAuth}
                                             product={product}
                                             favorites={true}/>
                        }) : 'Ничего нет'
                    }</div>
                    {count > limit &&
                        <Button variant={theme.colors.bootstrapMainVariant} className={'show-more'}  onClick={() => {
                            setLimit(limit * 2)
                            getFavorites(limit * 2);
                        }}>Показывать больше</Button>}
                </> : <Load/>
        }</Styled>
    );
};

export default Favorites;