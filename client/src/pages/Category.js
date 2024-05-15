import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {deleteItem, fetchAllItems} from "../http/itemAPI";
import {useParams} from "react-router-dom";
import CatalogItemCard from "../components/CatalogItemCard";
import * as uf from "../usefulFunctions";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import Pgn from "../components/miniComponents/Pgn";
import {Button} from "react-bootstrap";
import {authAPI} from "../http/userAPI";

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  .show-more {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    button {
      width: 300px;
    }
  }
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
  }
  .card_container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    @media (max-width: 575.5px) {
      justify-content: space-between;
    }
  }
`

const Category = observer( () => {
    const {item} = useContext(Context);
    const {user} = useContext(Context);
    const [page, setPage] = useState(1);
    let {categoryId} = useParams();
    const fetchItems = () => {
        if (categoryId === 'all') {
            fetchAllItems(null, item.limit, page).then(data => {
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
        return <CatalogItemCard key={uf.routePrefix('item', product.id)} delItem={delItem} isAuth={user.isAuth}
                                product={product} fetchItems={fetchItems}/>
    });
    const pagesAmount = Math.ceil(item.count/item.limit);
    const clickPage = (num) => {
        setPage(num)
    }
    useEffect(fetchItems, [item, categoryId, item?.limit, page]);
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
                {cards}
            </div>
            {(item.count > item.limit && page === 1) &&
                <div className={'show-more'}>
                    <Button variant={"success"} onClick={() => {
                        item.setLimit(item.limit + item.limit);
                    }}>Показывать больше</Button>
                </div>
            }
            {pagesAmount > 1 &&
                <Pgn pagesAmount={pagesAmount} page={page} clickPage={clickPage}/>
            }
        </Styled>
    );
});

export default Category;