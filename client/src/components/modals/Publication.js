import React, {useContext, useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import {useTheme} from "styled-components";
import {breakpoints, standardValues, staticColors, Theme} from "../../StyledGlobal";
import {Context} from "../../index";
import InfoLinkField from "../item/InfoLinkField";
import UpdateButton from "../buttons/UpdateButton";
import CustomOverlay from "../badges_and_overlays/CustomOverlay";
import useWindowSize from "../../hooks/useWindowSize";
import {observer} from "mobx-react-lite";
import StructurePublicationButtons from "../buttons/StructurePublicationButtons";
import {authAPI} from "../../api";
import {addImagesToFormData} from "../../usefulFunctions";

const Publication = observer(({publication}) => {
    const theme = useTheme();
    const width = useWindowSize();
    const {overlay, linkInfo, blog} = useContext(Context);
    const [showModal, setShowModal] = useState(false);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [structure, setStructure] = useState('left');

    const handleCancel = () => {
        setText(publication?.text || '');
        setTitle(publication?.title || '');
        setStructure(publication?.structure || 'left');
        linkInfo.setLinks(publication?.links ? JSON.parse(publication.links) : []);
        setShowModal(false);
        overlay.setShow(false);
    }
    const handlerPublication = () => {
        let formData = new FormData();
        publication && formData.append('id', publication.id);
        publication?.title !== title && formData.append('title', title);
        publication?.text !== text && formData.append('text', text);
        (JSON.stringify(publication?.links) !== JSON.stringify(linkInfo.links)) && formData.append('links', JSON.stringify(linkInfo.links));
        formData = addImagesToFormData(formData, images);
        structure && formData.append(`structure`, structure);
        authAPI('post', '/api/blog', formData).then(() => {
            if (publication) {
                blog.fetch();
                setShowModal(false);
                overlay.setShow(false);
            }
            else {
                overlay.setMessage(`Опубликовано`);
                overlay.setColor(theme.colors.mainOpacity);
                handleCancel();
                overlay.handlerOverlay();
            }
        }).catch(err => {
            overlay.setMessage(err.response?.data || 'Непредвиденная ошибка');
            overlay.setColor(staticColors.opacityRed);
            overlay.handlerOverlay();
            !publication && setShowModal(false);
        })
    }
    useEffect(() => {
        showModal && publication?.links && linkInfo.setLinks(JSON.parse(publication.links));
        setText(publication?.text || '');
        setTitle(publication?.title || '');
        setStructure(publication?.structure || 'left');
    }, [linkInfo, publication, showModal]);
    return (
        <div onClick={(e) => e.stopPropagation()}
             style={{width: '100%', display: "flex", justifyContent: "flex-start"}}>
            {publication ? <UpdateButton right={'45px'} handleModal={setShowModal} isActive={showModal}/> :
                <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                    setShowModal(true);
                    overlay.setTarget(e.target);
                    overlay.setShow(false);
                }} style={width >= breakpoints.rawFromSmall ? {width: standardValues.freeButtonWidth} : {width: '100%'}}>
                    Публикация
                </Button>}
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    overlay.setShow(false);
                }}
                backdrop="static"
                keyboard={false}
                data-bs-theme={Theme.dark ? "dark" : "light"}
                style={{color: theme.colors.textColor}}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ведение блога</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formPublicationTitle">
                            <Form.Label>Заголовок</Form.Label>
                            <Form.Control type="text" value={title}
                                          onChange={(e) => setTitle(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPublicationText">
                            <Form.Label>Текст</Form.Label>
                            <Form.Control as={"textarea"} type="text" value={text} style={{minHeight: '120px'}}
                                          onChange={(e) => setText(e.target.value)}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formPublicationImage">
                            <Form.Label>Изображение</Form.Label>
                            <Form.Control type="file" accept="image/*" onChange={(event) => {
                                setImages(event.target.files);
                            }}/>
                        </Form.Group>
                        <StructurePublicationButtons structure={structure} setStructure={setStructure}/>
                        <div className="mb-3" style={{display: "flex", flexDirection: "column"}}>
                        {linkInfo.links.length > 0 && <div className={'mb-2'}>Ссылки</div>}
                        {linkInfo.links.map((linkObj, index) => {
                            return <InfoLinkField
                                key={index} index={index}
                                title={linkObj.title}
                                content={linkObj.content}
                                handler={linkInfo.handler}
                                place={'link'}
                            />
                        })}
                        <Button variant={theme.colors.bootstrapMainVariant} onClick={() => linkInfo.handler('create', 'link')}
                                className={'mt-3'} style={{width: '50%', alignSelf: "center", color: theme.colors.btnTextColor}}
                        >Добавить ссылку</Button>
                    </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel} style={{color: theme.colors.btnTextColor}}>
                        Отменить
                    </Button>
                    <Button variant={theme.colors.bootstrapMainVariant} onClick={(e) => {
                        publication && overlay.setTarget(e.target);
                        handlerPublication();
                    }} style={{color: theme.colors.btnTextColor}}>
                        {publication ? 'Изменить' : 'Опубликовать'}
                    </Button>
                </Modal.Footer>
            </Modal>
            <CustomOverlay show={overlay.show} color={overlay.color} target={overlay.target} message={overlay.message}/>
        </div>
    );
});

export default Publication;