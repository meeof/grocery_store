import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {useParams} from "react-router-dom";
import ItemCard from "../components/cards/ItemCard";
import * as uf from "../usefulFunctions";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import CustomPagination from "../components/CustomPagination";
import {Button} from "react-bootstrap";
import {API, authAPI, authorization} from "../api";
import {colors, customGrid, flexColumn, freeButtonWidth, marginSmall, marginsPage} from "../StyledGlobal";

const Styled = styled.div`
  ${flexColumn};
  ${marginsPage};
  .show-more {
    display: flex;
    justify-content: center;
    margin-top: ${marginSmall};
    margin-bottom: ${marginSmall};
    button {
      width: ${freeButtonWidth};
    }
  }
  .card_container {
    ${customGrid};
  }
`

const Category = observer( () => {
    const {item} = useContext(Context);
    const {user} = useContext(Context);
    const [page, setPage] = useState(1);
    let {categoryId} = useParams();
    const fetchItems = () => {
        if (categoryId === 'all') {
            API('get', '/api/item', {
                    categoryId: null,
                    limit: item.limit,
                    page,
                    find: item.find
                }).then(data => {
                item.setItems(data.rows);
                item.setCount(data.count);
            });
        }
        else if (categoryId) {
            API('get', '/api/item',{
                    categoryId: uf.routeUnPrefix(categoryId),
                    limit: item.limit,
                    page,
                    find: item.find
                }).then(data => {
                item.setItems(data.rows);
                item.setCount(data.count);
            });
        }
    }
    const delItem = (id) => {
        authAPI('delete', '/api/item', {id}).then((data) => {
            fetchItems();
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    let cards = item.items?.map(product => {
        return <ItemCard key={uf.routePrefix('item', product.id)} delItem={delItem} isAuth={user.isAuth}
                         product={product} fetchItems={fetchItems}/>
    });
    const pagesAmount = Math.ceil(item.count/item.limit);
    const clickPage = (num) => {
        setPage(num)
    }
    useEffect(fetchItems, [item, categoryId, item?.limit, page, user.rerender]);
    useEffect(() => {
        authorization().then(data => {
            user.setAuth(data);
        }).catch(err => {
            user.setAuth(false);
        })
    }, [user]);
    return (
        <Styled>
            <div className={'card_container'}>
                {cards.length > 0 ? cards : 'Ничего нет'}
            </div>
            {(item.count > item.limit && page === 1) &&
                <div className={'show-more'}>
                    <Button variant={colors.bootstrapMainVariant} onClick={() => {
                        item.setLimit(item.limit + item.limit);
                    }}>Показывать больше</Button>
                </div>
            }
            {pagesAmount > 1 &&
                <CustomPagination pagesAmount={pagesAmount} page={page} clickPage={clickPage}/>
            }
        </Styled>
    );
});

export default Category;