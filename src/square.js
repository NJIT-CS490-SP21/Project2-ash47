import React from 'react';
import { useState } from 'react';
// import io from 'socket.io-client';

// const socket = io();

export function Square(props)
{
    
    function clickHandler()
    {
        if(props.value === null)
        {
            props.onClick(props.id);
        }
    }
    
    
    
    return(
        <div className={"box " + props.value} onClick={clickHandler}></div>  
    );
}