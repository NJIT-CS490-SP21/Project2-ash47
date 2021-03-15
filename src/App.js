import './App.css';
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import io from 'socket.io-client';
import { Board } from './Board';
import { Leaderboard } from './leaderboard';
import { UserBox } from './userbox';
import { ChatBox } from './chatbox';
import './Board.css';

const socket = io(); // Connects to socket connection

function App() {
  const inputRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [userCounter, setUserCounter] = useState([]);

  const [loginStatus, setLoginStatus] = useState('loggedOut');
  const [currentUser, setCurrentUser] = useState(null);

  const [emptyInput, setEmptyInput] = useState(false);

  useEffect(() => {
    socket.on('login', (data) => {
      setUsers(data.userList);
      setUserCounter(data.userNum);
    });

    socket.on('logout', (data) => {
      setUsers(data.userList);
      setUserCounter(data.userNum);
    });
  }, []);

  function changeLoginStatus() {
    setLoginStatus((currLogin) => (currLogin === 'loggedIn' ? 'loggedOut' : 'loggedIn'));
  }

  function logIn() {
    const userName = inputRef.current.value;
    if (userName !== '') {
      setEmptyInput(false);
      setCurrentUser(userName);
      changeLoginStatus();

      socket.emit('login', { newUser: userName });
    } else {
      setEmptyInput(true);
    }
  }

  function logout() {
    changeLoginStatus();
    socket.emit('logout', { user: currentUser });

    if (currentUser === users[0] || currentUser === users[1]) {
      const EmptyList = [null, null, null, null, null, null, null, null, null];
      socket.emit('move', { reset: EmptyList });
    }
  }

  function Login(props) {
    const { isLoggedIn } = props;
    // console.log(isLoggedIn);
    if (isLoggedIn !== 'loggedIn') {
      // console.log(isLoggedIn);
      return (
        <div className="wrap">
          <div className="loginBox" id="loginBox">
            <div className="heading">Welcome to my app..!!</div>
            <h3>Please enter your username to login</h3>
            <br />
            <br />
            <input
              className="input"
              ref={inputRef}
              type="text"
              placeholder="User name...."
            />
            {emptyInput === false ? (
              ''
            ) : (
              <div className="errMsg">Please enter a valid username</div>
            )}
            <button className="button" type="submit" onClick={logIn}>
              Submit
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="wrap">
        <div className="gameBoard" id="gameBoard">
          <div className="turnH">
            <h1>
              {`Welcome to tic tac toe, ${currentUser}`}
            </h1>
          </div>

          <UserBox users={users} userCounter={userCounter} />

          <Board
            usersList={users}
            currentUser={currentUser}
            socket={socket}
          />

          <div>
            <ChatBox user={currentUser} socket={socket} />
          </div>

          <div className="btn_wrap">
            <div className="logOutbtn">
              <button className="button lb" type="button" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        <br />
        <Leaderboard socket={socket} currentUser={currentUser} />
      </div>
    );
  }

  Login.propTypes = {
    isLoggedIn: PropTypes.string,
  };
  Login.defaultProps = {
    isLoggedIn: PropTypes.string,
  };

  return (
    <center>
      <Login isLoggedIn={loginStatus} />
    </center>
  );
}

export default App;
