import React, { useState, useEffect } from 'react';
import './Board.css';
import PropTypes from 'prop-types';
import { Square } from './square';
import { calculateWinner } from './winner';
import { isDraw } from './checkDraw';
import { WinLine } from './drawLine';

export function Board(props) {
  const [board, setBoard] = useState([
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ]);
  const [turn, setTurn] = useState('X');
  const [spectator, setSpectator] = useState(false);

  const { usersList, currentUser, socket } = props;
  const playerX = usersList[0];
  const playerO = usersList[1];
  const results = calculateWinner(board);
  const { winner } = results;
  const WinnerCombo = results.combination;
  const draw = isDraw(board);

  useEffect(() => {
    if (winner !== null) {
      if (winner === 'X' && currentUser === playerX) {
        socket.emit('changeStats', { winner: playerX, losser: playerO });
      } else if (winner === 'O' && currentUser === playerX) {
        socket.emit('changeStats', { winner: playerO, losser: playerX });
      }
    }
  }, [winner]);

  useEffect(() => {
    if (currentUser !== playerX && currentUser !== playerO) {
      setSpectator(true);
    }

    socket.emit('currentBoard');

    socket.on('currentBoard', (data) => {
      setBoard((prevData) => {
        let newBoard = [...prevData];
        newBoard = data.board;
        return newBoard;
      });
    });
  }, []);

  function changeTurn() {
    setTurn((prevTurn) => (prevTurn === 'X' ? 'O' : 'X'));
  }

  function updateBoard(id) {
    setBoard((prevList) => {
      const newBoard = [...prevList];
      newBoard[id] = turn;
      return newBoard;
    });

    changeTurn();

    socket.emit('move', { move: id, turn });
  }

  function onClickAction(id) {
    if (winner === null) {
      if (currentUser === playerX && turn === 'X') {
        updateBoard(id);
      } else if (currentUser === playerO && turn === 'O') {
        updateBoard(id);
      }
    }
  }

  function resetBoard() {
    const EmptyList = [null, null, null, null, null, null, null, null, null];
    setBoard(EmptyList);
    setTurn('X');

    socket.emit('move', { reset: EmptyList });
  }

  useEffect(() => {
    socket.on('move', (data) => {
      changeTurn();

      setBoard((prevList) => {
        const newBoard = [...prevList];
        newBoard[data.move] = data.turn;
        return newBoard;
      });

      if (data.reset) {
        setBoard(data.reset);
        setTurn('X');
      }
    });
  }, []);

  return (
    <div className="board_wrap">
      <div className="board_grid">
        {draw === true ? (
          <div className="turnH">
            <h1>Draw..!!</h1>
          </div>
        ) : (
          [
            winner !== null ? (
              [
                winner === 'X' ? (
                  <div className="turnH">
                    <h1>
                      Winner is:
                      {`${winner} ${playerX}!!`}
                    </h1>
                  </div>
                ) : (
                  <div className="turnH">
                    <h1>
                      Winner is:
                      {`${winner} ${playerO}!!`}
                    </h1>
                  </div>
                ),
              ]
            ) : (
              <div className="turnH" />
            ),
          ]
        )}
        {turn === 'X' ? (
          <div className="pX">
            <b>{`X ${playerX}`}</b>
          </div>
        ) : (
          <div className="pX">{`X: ${playerX}`}</div>
        )}
        <div className="game">
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
          <WinLine WinnerCombo={WinnerCombo} />
        </div>
        {turn === 'O' ? (
          <div className="pO">
            <b>{`O ${playerO}`}</b>
          </div>
        ) : (
          <div className="pO">{`O: ${playerO}`}</div>
        )}
        {spectator === true ? (
          <div />
        ) : (
          [
            winner !== null || draw === true ? (
              <div className="resetBtn">
                <button
                  className="button lb"
                  type="button"
                  onClick={resetBoard}
                >
                  Reset Board
                </button>
              </div>
            ) : null,
          ]
        )}
      </div>
    </div>
  );
}

Board.propTypes = {
  usersList: PropTypes.arrayOf(PropTypes.string),
  currentUser: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.object),
};

Board.defaultProps = {
  usersList: PropTypes.arrayOf(PropTypes.string),
  currentUser: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.object),
};

export default Board;
