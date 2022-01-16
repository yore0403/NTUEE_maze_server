import React, { useState } from "react";
import { ListGroup, ListGroupItem, Container } from "reactstrap";

export default (props) => {
    let {message} = "props.ip";
    return (
        <h3>{props.ip}</h3>
    );
};
