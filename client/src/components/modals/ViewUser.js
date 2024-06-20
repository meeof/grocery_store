import React from 'react';
import noImage from "../../assets/light/icon_no_image.svg";
import {Image, Modal} from "react-bootstrap";
import {dateString} from "../../usefulFunctions";
const ViewUser = ({showUser, setShowUser, name, surname, status, about, image, profileCreated}) => {
    const created = dateString(profileCreated, true);
    return (
        <Modal
            show={showUser}
            backdrop="static"
            keyboard={false}
            onHide={() => {
                setShowUser(false);
            }}
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