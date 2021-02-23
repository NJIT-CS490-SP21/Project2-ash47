import React from 'react';
import { useState, useEffect } from 'react';
import './Board.css';
import { Square } from './square.js';
import io from 'socket.io-client';

const socket = io();

export function Board()
{
    const [board, setBoard] = useState([null, null, null, null, null, null, null, null, null]);
    const [turn, setTurn] = useState("X");
    /*
    function changeTurn(id)
    {
      //setTurn(prevTurn => prevTurn === 'X' ? 'O' : 'X');
      
      setTurn((prevTurn) => {
        let nextTurn = '';
        if(prevTurn === 'X')
        {
          nextTurn = 'O';
        }
        else
        {
          nextTurn = 'X';
        }
        socket.emit('move', { move: id, turn: nextTurn });
        return nextTurn;
      });
      
      console.log(turn);
    }
    */
    function onClickAction(id)
    {
      // set board
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        newBoard[id] = turn;
        
        socket.emit('move', { move: newBoard });
        
        return newBoard;
      })
      //changeTurn(id);
      //setTurn(prevTurn => prevTurn === 'X' ? 'O' : 'X');
    }
    
    function resetBoard()
    {
      
    }
    
    
    useEffect(() => {
      
      socket.on('move', (data) =>{
        
        setBoard((prevBoard) => {
          let newBoard = data.move;
          return newBoard;
        });
        
        // setTurn(data.turn);
        
        console.log('received: ' + turn);
      });
      //changeTurn();
    }, []);
    
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