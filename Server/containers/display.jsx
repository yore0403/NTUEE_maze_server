import React, { useState } from "react";
import { ListGroup, ListGroupItem, Container } from "reactstrap";

export default (props) => {
    let {message} = "props.m";
    
    return (
        <p className="displayText">{props.m}</p>
    );
};

