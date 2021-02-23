import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import './Board.css';

const socket = io(); // Connects to socket connection

function App() {
  
  const [ users, setUsers ] = useState([]);
  const inputRef = useRef(null);
  const [ loginStatus, setLoginStatus ] = useState(false);
  
  
  function changeLogin()
  {
    setLoginStatus(true);
  }
  
  function onClickAction()
  {
    const userName = inputRef.current.value;
    setUsers(prevList => [...prevList, userName]);
    changeLogin();
    
    socket.emit('login', { newUser: userName });
  }
  
  function Login(props)
  {
    console.log("Something")
    const loginStatus = props.isLoggedIn;
    if(loginStatus)
    {
      return <Board />
    }
    
    else
    {
      return (
        
        <div>
          <input ref={inputRef} type="text" name="name" />
          <button onClick= {onClickAction}>Submit</button>
        </div>
        
      );
    }
    
  }
  
  console.log(users);
  
  return(
    <center>
      
      <Login isLoggedIn={loginStatus} />
      
    </center>
  );
  
}

export default App;