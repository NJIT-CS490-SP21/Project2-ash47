import { useState, useEffect } from 'react';
import './Board.css';
import { Square } from './square.js';
import { calculateWinner } from './winner.js';
import { isDraw } from './checkDraw';

export function Board(props)
{
    const [ board, setBoard ] = useState([null, null, null, null, null, null, null, null, null]);
    const [turn, setTurn] = useState("X");
    const [ spectator, setSpectator ] = useState(false);
    
    const playerX = props.usersList[0];
    const playerO = props.usersList[1];
    const winner = calculateWinner(board);
    const draw = isDraw(board);
    
    useEffect(() => {
      if(winner !== null)
      {
        if(winner === 'X' && props.currentUser === playerX )
        {
          props.socket.emit('changeStats', {'winner': playerX, 'losser': playerO});
        }
        else if(winner === 'O' && props.currentUser === playerX )
        {
          props.socket.emit('changeStats', {'winner': playerO, 'losser': playerX});
        }
      }
    }, [winner]);
    
    useEffect(() => {
      
      let mounted = true;
      
      if(props.currentUser !== playerX && props.currentUser !== playerO)
      {
        setSpectator(true);
      }
      
      props.socket.on('all_users', (data) => {
        console.log(data);
      });
      
      props.socket.emit('currentBoard');
      
        props.socket.on('currentBoard', (data) => {
        if(mounted)
        {
          setBoard((prevData) => {
            let newBoard = [...prevData];
            newBoard = data.board;
            return newBoard;
          });
        }
      });
      
      return () => mounted = false;
        
    }, []);
    
    function changeTurn()
    {
      setTurn(prevTurn => prevTurn === 'X' ? 'O' : 'X');
    }
    
    function updateBoard(id)
    {
      setBoard((prevList) => {
        let newBoard = [...prevList];
        newBoard[id] = turn;
        return newBoard;
      });
      
      changeTurn();
      
      props.socket.emit('move', { move: id, turn: turn });
    }
    
    function onClickAction(id)
    {
      if(winner === null)
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
    }
    
    function resetBoard()
    {
      let empty_list = [null, null, null, null, null, null, null, null, null];
      setBoard(empty_list);
      setTurn('X');
      
      props.socket.emit('move', {reset: empty_list});
    }
    
    useEffect(() => {
      props.socket.on('move', (data) => {
        changeTurn();
        
        setBoard((prevList) => {
            let newBoard = [...prevList];
            newBoard[data.move] = data.turn;
            return newBoard;
        });
        
        if(data.reset)
        {
          setBoard(data.reset);
          setTurn('X');
        }
      });
    }, []);
    
    return (
      <div className="board_wrap">
        <div className="board_grid">
        {draw === true ?
          <div className="turnH"><h1>It's a draw..!!</h1></div> :
          [winner !== null ? 
            [winner === 'X' ? <div className="turnH"><h1>Winner is: {winner + ' ' + playerX + '!!'}</h1></div>:
                              <div className="turnH"><h1>Winner is: {winner + ' ' + playerO + '!!'}</h1></div>] : 
            <div className="turnH"></div>
          ]
        }
        {turn==='X' ? <div className="pX"><b>{'X ' + playerX}</b></div> : <div className="pX">{'X ' + playerX}</div>}
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
        {turn==='O' ? <div className="pO"><b>{'O ' + playerO}</b></div> : <div className="pO">{'O ' + playerO}</div>}
        {spectator === true ?
          <div></div> 
          :
          [winner !== null || draw === true ?
            <div className="resetBtn">
              <button className="button" type="button" onClick={resetBoard}>Reset Board</button> 
            </div>:
            null
          ]
        }
        </div>
      </div>
    
    );
    
}