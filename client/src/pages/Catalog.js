import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import CatalogCategoryCard from "../components/CatalogCategoryCard";
import * as uf from '../usefulFunctions';
import {Button} from "react-bootstrap";
import {Context} from "../index";
import {fetchCategories} from "../http/itemApi";
import {observer} from "mobx-react-lite";

const Styled = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  margin-right: 16px;
  @media (max-width: 575.5px) {
    margin-left: 8px;
    margin-right: 8px;
  }
  .view-all-button {
    width: 300px;
    align-self: center;
    margin-bottom: 5px;
    margin-top: 5px;
    @media (max-width: 575.5px) {
      width: 100%;
    }
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

const Catalog = observer( () => {
    const {item} = useContext(Context);
    useEffect(() => {
        fetchCategories().then(data => {
            item.setCategories(data);
        })
    }, [item]);
    const navigate = useNavigate();
    let {categoryId} = useParams();
    let cards  = item.categories?.map(category => {
            return <CatalogCategoryCard key={uf.routePrefix('category', category.id)}
                                        img={category.image} name={category.name} id={category.id}/>
        });
    return (
        <Styled>
            {!categoryId && <Button variant={"success"} className={'view-all-button'}
                                    onClick={() => navigate(`all`)}
            >Показать все</Button>}
            <div className={'card_container'}>
                {cards}
            </div>
        </Styled>
    );
});

export default Catalog;