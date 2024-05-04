import React, {useContext, useEffect} from 'react';
import styled from "styled-components";
import {useNavigate, useParams} from "react-router-dom";
import CatalogCategoryCard from "../components/CatalogCategoryCard";
import {Button} from "react-bootstrap";
import {Context} from "../index";
import {deleteCategory, fetchCategories, updateCategory} from "../http/itemApi";
import {observer} from "mobx-react-lite";
import {authAPI} from "../http/userAPI";

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
    const {user} = useContext(Context);
    useEffect(() => {
        fetchCategories().then(data => {
            item.setCategories(data);
        });
        authAPI().then(data => {
            user.setAuth(data);
        }).catch(err => {
            user.setAuth(false);
        })
    }, [item, user]);
    const delCategory = (id) => {
        deleteCategory(id).then((data) => {
            fetchCategories().then(data => {
                item.setCategories(data);
            });
        }).catch(err => {
            console.log(err.response.data);
        })
    }
    const navigate = useNavigate();
    let {categoryId} = useParams();
    let cards  = item.categories?.map(category => {
            return <CatalogCategoryCard key={category.id} delCategory={delCategory}
                                        img={category.image} name={category.name} id={category.id} isAuth={user.isAuth} />
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