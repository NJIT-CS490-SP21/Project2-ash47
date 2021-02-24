import React from 'react';
import { useState, useEffect } from 'react';
import './Board.css';
import { Square } from './square.js';
import io from 'socket.io-client';

const socket = io();

export function Board(props)
{
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
    const [turn, setTurn] = useState("X");
    
    const [ playerX, setPlayerX ] = useState(props.usersList[0]);
    
    const [ playerO, setPlayerO ] = useState(props.usersList[1]);
    
    
    console.log(playerX);
    console.log(playerO);
    
    function changeTurn()
    {
      setTurn(prevTurn => turn === 'X' ? 'O' : 'X');
    }
    
    function onClickAction(id)
    {
      let prevList = [...board];
      prevList[id] = turn;
      setBoard(prevList);
      changeTurn();
      
      socket.emit('move', { move: id });
    }
    
    function resetBoard()
    {
      let empty_list = [null, null, null, null, null, null, null, null, null];
      setBoard(empty_list);
      setTurn('X');
      
      socket.emit('move', {reset: empty_list});
    }
    
    useEffect(() => {
      
      socket.on('move', (data) => {
        console.log('Chat event received!');
        console.log(data.move)
        changeTurn();
        
        let list = [...board];
        list[data.move] = turn;
        setBoard(list);
        
        if(data.reset)
        {
          setBoard(data.reset);
          setTurn('X');
        }
      });
    }, [board]);
    
    return (
    <div>
      <h1>Next turn {turn}</h1>
      <div class="board">
        <Square id={0} value={board[0]} onClick={onClickAction} />
        <Square id={1} value={board[1]} onClick={onClickAction} />
        <Square id={2} value={board[2]} onClick={onClickAction} />
        <Square id={3} value={board[3]} onClick={onClickAction} />
        <Square id={4} value={board[4]} onClick={onClickAction} />
        <Square id={5} value={board[5]} onClick={onClickAction} />
        <Square id={6} value={board[6]} onClick={onClickAction} />
        <Square id={7} value={board[7]} onClick={onClickAction} />
        <Square id={8} value={board[8]} onClick={onClickAction} />
      </div>
      <button type="button" onClick={resetBoard}>Reset Board</button>
      
    </div>
    
    );
    
}