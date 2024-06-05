import React, {useCallback, useContext, useEffect} from 'react';
import {Context} from "../index";
import {useParams} from "react-router-dom";
import ItemCard from "../components/cards/ItemCard";
import * as uf from "../usefulFunctions";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import CustomPagination from "../components/CustomPagination";
import {API, authAPI, authorization} from "../api";
import {customGrid, flexColumn, marginsPage} from "../StyledGlobal";
import Load from "../components/Load";

const Styled = styled.div`
  ${flexColumn};
  ${marginsPage};
  .card_container {
    ${customGrid};
  }
`

const Category = observer( () => {
    const {item, user} = useContext(Context);
    let {categoryId} = useParams();
    const fetchItems = useCallback( (page, limit) => {
        const params = {limit, page, find: item.find}
        if (categoryId !== 'all') {
            params.categoryId = uf.routeUnPrefix(categoryId);
        }
        API('get', '/api/item', params).then(data => {
            if (item.items !== data.rows) {
                item.setItems(data.rows);
                item.setCount(data.count);
            }
        });
    }, [categoryId, item])
    const delItem = (id) => {
        authAPI('delete', '/api/item', {id}).then(() => {
            fetchItems(1, item.limit);
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    useEffect(() => {
        if (!user.isAuth) {
            authorization().then(data => {
                user.setAuth(data);
            }).catch(() => {
                user.setAuth(false);
            }).finally(() => {
                fetchItems(1, item.limit);
            })
        }
        else {
            fetchItems(1, item.limit);
        }
    }, [item, fetchItems, user, user.rerender]);
    return (
        <Styled>
            {item.items ?
                <div className={'card_container'}>
                    {item.items.length > 0 ?
                        item.items.map(product => {
                            return <ItemCard key={uf.routePrefix('item', product.id)} delItem={delItem}
                                             isAuth={user.isAuth}
                                             product={product} fetchItems={fetchItems}/>
                        }) : 'Ничего нет'}
                </div> : <Load/>}
            {item.count > item.limit && <CustomPagination fetchItems={fetchItems}/>}
        </Styled>
    );
});

export default Category;