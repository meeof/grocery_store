import React from 'react';
import {Spinner} from "react-bootstrap";

const Load = () => {
    return (
        <Spinner animation="border" role="status" style={{position: "absolute", left: '50%', top: '50%'}}>
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    );
};

export default Load;