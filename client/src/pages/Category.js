import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {deleteItem, fetchAllItems} from "../api/itemAPI";
import {useParams} from "react-router-dom";
import ItemCard from "../components/cards/ItemCard";
import * as uf from "../usefulFunctions";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import CustomPagination from "../components/CustomPagination";
import {Button} from "react-bootstrap";
import {authAPI} from "../api/userAPI";
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
            fetchAllItems(null, item.limit, page, item.find).then(data => {
                item.setItems(data.rows);
                item.setCount(data.count);
            });
        }
        else if (categoryId) {
            fetchAllItems(uf.routeUnPrefix(categoryId), item.limit, page).then(data => {
                item.setItems(data.rows);
                item.setCount(data.count);
            });
        }
    }
    const delItem = (id) => {
        deleteItem(id).then((data) => {
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
        authAPI().then(data => {
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
                    <Button variant={colors.bootstrapVariant} onClick={() => {
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