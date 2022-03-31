import React, { useState } from "react";
import { ListGroup, ListGroupItem, Container } from "reactstrap";
// import reactStringReplace from 'react-string-replace';

export default (props) => {
    const reactStringReplace = require('react-string-replace');
    let message = props.m;
    console.log("ddddd")
    let mm = reactStringReplace(message, /(\?|!|>|<|ʌ|v)/g, (match, i) => (
        match=='?'?
            <span className="redText" key={i}>{match}</span>:
            (match=='!'?
            <span className="greenText" key={i}>{match}</span>:
            <span className="orangeText" key={i}>{match}</span>)

      ));
    mm = mm.map((component, i) => (
        typeof(component)=="string"?
        <span key={i}>{component}</span>:
        component));
    console.log(mm)
    return (
        // <p className="displayText">{props.m}</p>
        <div className="displayText">
            <p>{mm}</p>
        
      </div>

    );
};

