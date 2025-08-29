import React from "react";

function Saludos(props) {
    console.log(props);
    return (
        <div>
            {props.firstName}
        </div>
    );
}

export default Saludos;
