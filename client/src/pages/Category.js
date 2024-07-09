import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../index";
import {useParams} from "react-router-dom";
import ItemCard from "../components/cards/ItemCard";
import * as uf from "../usefulFunctions";
import styled from "styled-components";
import {observer} from "mobx-react-lite";
import CustomPagination from "../components/CustomPagination";
import {authAPI, authorization} from "../api";
import {customGrid, flexColumn, marginsPage} from "../StyledGlobal";
import Load from "../components/Load";
import FilterCanvas from "../components/filter/FilterCanvas";

const Styled = styled.div`
  ${flexColumn};
  ${marginsPage};
  .card_container {
    ${customGrid};
  }
`

const Category = observer( () => {
    const {item, user, render} = useContext(Context);
    const {categoryId} = useParams();
    const [showCanvas, setShowCanvas] = useState(false);
    const delItem = (id) => {
        authAPI('delete', '/api/item', {id}).then((data) => {
            if (data === 'Unauthorized') {
                return
            }
            item.fetchItems();
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
                item.setCategoryId(categoryId);
                !item.items && item.fetchItems();
            })
        }
        else {
            item.setCategoryId(categoryId)
            !item.items && item.fetchItems();
        }
    }, [item, user, render.rerender, categoryId]);
    return (
        <Styled>
            {item.items ?
                <div className={'card_container'}>
                    {item.items.length > 0 ?
                        item.items.map(product => {
                            return <ItemCard key={uf.routePrefix('item', product.id)} delItem={delItem}
                                             isAuth={user.isAuth}
                                             product={product}/>
                        }) : 'Ничего нет'}
                </div> : <Load/>}
            {item.count > item.limit && <CustomPagination/>}
            <FilterCanvas show={showCanvas} setShow={setShowCanvas}/>
        </Styled>
    );
});

export default Category;