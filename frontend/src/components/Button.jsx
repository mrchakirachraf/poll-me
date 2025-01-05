import React from "react";

const Button = (props) => {
    return (
        <button style={props.style} className={`${props.class} btn`}>{props.text}</button>
    );
}

export default Button;