import React, {useContext, useEffect} from 'react';
import {Context} from "../index";
import {fetchAllItems} from "../http/itemApi";
import {useParams} from "react-router-dom";
import CatalogItemCard from "../components/CatalogItemCard";
import * as uf from "../usefulFunctions";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import Pgn from "../components/miniComponents/Pgn";
import {Button} from "react-bootstrap";

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
    let {categoryId} = useParams();
    let cards = item.items?.map(product => {
        return <CatalogItemCard key={uf.routePrefix('item', product.id)}
                                name={product.name} price={product.price} discount={product.discount}
                                img={product.images?.[0]} id={product.id}/>
    });
    useEffect(() => {
        if (categoryId === 'all') {
            fetchAllItems(null, item.limit).then(data => {
                item.setItems(data.rows);
                item.setCount(data.count);
            });
        }
        else if (categoryId) {
            fetchAllItems(uf.routeUnPrefix(categoryId), item.limit).then(data => {
                item.setItems(data.rows);
                item.setCount(data.count);
            });
        }
    }, [item, categoryId, item.limit]);
    return (
        <Styled>
            <div className={'card_container'}>
                {cards}
            </div>
            {item.count > item.limit &&
                <div className={'show-more'}>
                    <Button variant={"success"} onClick={() => {
                        item.setLimit(item.limit + 3);
                    }}>Показать больше</Button>
                </div>
            }
            <Pgn/>
        </Styled>
    );
});

export default Category;