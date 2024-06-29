import React, {useCallback, useContext, useEffect} from 'react';
import styled, {useTheme} from "styled-components";
import {customGrid, flexColumn, marginsCenter, marginsPage, standardValues} from "../StyledGlobal";
import {Context} from "../index";
import {useNavigate} from "react-router-dom";
import {authAPI} from "../api";
import Load from "../components/Load";
import * as uf from "../usefulFunctions";
import ItemCard from "../components/cards/ItemCard";
import {Button} from "react-bootstrap";
import {observer} from "mobx-react-lite";
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

const Favorites = observer(() => {
    const navigate = useNavigate();
    const theme = useTheme();
    const {user, favorites} = useContext(Context);
    const getFavorites = useCallback((limit) => {
        authAPI( 'get', '/api/favorites', {limit}).then((data) => {
            favorites.setFavorites(data.rows);
            favorites.setCount(data.count);
        }).catch(err => {
            console.log(err);
            navigate('/profile/login');
        })
    }, [navigate, favorites]);
    const delFavorites = (itemId) => {
        authAPI('delete', '/api/favorites', {itemId}).then(() => {
            getFavorites(favorites.limit);
        }).catch(err => {
            console.log(err);
        })
    }
    useEffect(() => {
        if (!favorites.favorites) {
            getFavorites(favorites.limit)
        }
    }, [getFavorites, favorites]);
    return (
        <Styled>{
            favorites.favorites ? <>
                    <div className={"card_container"}>{
                        favorites.favorites.length > 0 ? favorites.favorites.map(product => {
                            return <ItemCard key={uf.routePrefix('item', product.id)} delItem={delFavorites}
                                             isAuth={user.isAuth}
                                             product={product}
                                             favorites={true}/>
                        }) : 'Ничего нет'
                    }</div>
                    {favorites.count > favorites.limit &&
                        <Button variant={theme.colors.bootstrapMainVariant} className={'show-more'}  onClick={() => {
                            favorites.setLimit(favorites.limit * 2)
                            getFavorites(favorites.limit * 2);
                        }}>Показывать больше</Button>}
                </> : <Load/>
        }</Styled>
    );
});

export default Favorites;