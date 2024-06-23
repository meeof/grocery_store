import React from 'react';
import noImage from "../../assets/icon-picture.svg";
import {Image, Modal} from "react-bootstrap";
import {dateString} from "../../usefulFunctions";
import {Theme} from "../../StyledGlobal";
import {useTheme} from "styled-components";
const ViewUser = ({showUser, setShowUser, name, surname, status, about, image, profileCreated}) => {
    const theme = useTheme();
    const created = dateString(profileCreated, true);
    return (
        <Modal
            show={showUser}
            backdrop="static"
            keyboard={false}
            onHide={() => {
                setShowUser(false);
            }}
            data-bs-theme={Theme.dark ? "dark" : "light"}
            style={{color: theme.colors.textColor}}
        >
            <Modal.Header closeButton/>
            <Modal.Body style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <div style={{width: '100%', display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Image src={image ?
                        process.env.REACT_APP_API_URL + image : noImage}
                           roundedCircle style={{width: '50%', left: "auto", right: 'auto', alignSelf: "center"}}/>
                    <h2>{name} {surname}</h2>
                    <i>{created}</i>
                    <h3>{status}</h3>
                    <p>{about}</p>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ViewUser;