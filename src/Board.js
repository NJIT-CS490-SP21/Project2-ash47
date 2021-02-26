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
    
    const [ spectator, setSpectator ] = useState(false);
    
    useEffect(() => {
      let mounted = true;
      
      if(props.currentUser !== playerX && props.currentUser !== playerO)
      {
        setSpectator(true);
      }
      
      socket.emit('currentBoard');
      
        socket.on('currentBoard', (data) => {
        //setBoard(data);
        if(mounted)
        {
          setBoard((prevData) => {
            let newBoard = [...prevData];
            newBoard = data;
            return newBoard;
          });
        }
      });
      
      return () => mounted = false;
        
    }, []);
    
    
    
    
    function changeTurn()
    {
      setTurn(prevTurn => turn === 'X' ? 'O' : 'X');
    }
    
    function updateBoard(id)
    {
      setBoard((prevList) => {
        let newBoard = [...prevList];
        newBoard[id] = turn;
        return newBoard;
      });
      
      changeTurn();
      
      socket.emit('move', { move: id, turn: turn });
    }
    
    function onClickAction(id)
    {
        if(props.currentUser === playerX && turn === 'X')
        {
          updateBoard(id);
        }
        else if(props.currentUser === playerO && turn === 'O')
        {
          updateBoard(id);
        }
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
        changeTurn();
        
        setBoard((prevList) => {
            let newBoard = [...prevList];
            newBoard[data.move] = turn;
            return newBoard;
        });
        
        if(data.reset)
        {
          setBoard(data.reset);
          setTurn('X');
        }
      });
    }, [board]);
    
    return (
    <div className="board_wrap">
      <h1>Next turn {turn}</h1>
      <div className="board">
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
      {spectator === true ?
        <div></div> 
        :
        <div>
          <button type="button" onClick={resetBoard}>Reset Board</button> 
        </div>
      }
      
    </div>
    
    );
    
}