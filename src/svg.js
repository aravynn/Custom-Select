import React from 'react';

function SelectArrow(props){
    return(
        <svg viewBox="0 0 72 72">
            <polygon points="16,36 72,8 72,0 0,36 72,72 72,64 "/>
        </svg>  
    );
}

function RemoveIcon(props){
    return(
        <svg viewBox="0 0 72 72">
            <polygon points="72,63.6 44.4,36 71.7,8.6 63.4,0.3 36,27.6 8.4,0 0,8.4 27.6,36 0.3,63.4 8.6,71.7 36,44.4 63.6,72 "/>
        </svg>
    );
}

export {SelectArrow, RemoveIcon};