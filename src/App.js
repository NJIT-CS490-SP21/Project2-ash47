import logo from './logo.svg';
import './App.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import { UserList } from './userList.js';
import './Board.css';

const socket = io(); // Connects to socket connection

function App() {
  
  const [ users, setUsers ] = useState([]);
  const inputRef = useRef(null);
  const [ loginStatus, setLoginStatus ] = useState('loggedOut');
  const [ currentUser, setCurrentUser ] = useState(null);
  
  
  function changeLogin()
  {
    setLoginStatus(currLogin => currLogin === 'loggedIn' ? 'loggedOut' : 'loggedIn');
  }
  
  function onClickAction()
  {
    const userName = inputRef.current.value;
    setCurrentUser(userName);
    changeLogin();
    
    
    socket.emit('login', { newUser: userName });
  }
  
  function logout()
  {
    changeLogin();
    socket.emit('logout', {user: currentUser});
  }
  
  function Game(props)
  {
    const loginStatus = props.isLoggedIn;
    
    if(loginStatus === 'loggedIn')
    {
      return (
        <div>
          <Board usersList={ users } />
          
          <ul class="userBox">
            {users.map(items => <UserList name={items} />)}
          </ul>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      );
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
  
  useEffect(() => {
    
    socket.on('login', (data) => {
      setUsers(data);
    });
    
    socket.on('logout', (data) => {
      setUsers(data);
    });
    
  }, []);
  
  console.log(users);
  
  return(
    <center>
      
      <Game isLoggedIn={loginStatus} />
      
    </center>
  );
  
}

export default App;