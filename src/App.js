import './App.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import './Board.css';

const socket = io(); // Connects to socket connection

function App() {
  
  const inputRef = useRef(null);
  
  const [ users, setUsers ] = useState([]);
  const [ loginStatus, setLoginStatus ] = useState('loggedOut');
  const [ currentUser, setCurrentUser ] = useState(null);
  
  const [ playerLogOut, setPlayerLogOut ] = useState(false);
  const [ userCounter, setUserCounter ] = useState([]);
  
  function changeLoginStatus()
  {
    setLoginStatus(currLogin => currLogin === 'loggedIn' ? 'loggedOut' : 'loggedIn');
  }
  
  function logIn()
  {
    const userName = inputRef.current.value;
    setCurrentUser(userName);
    changeLoginStatus();
    setPlayerLogOut(false);
    
    socket.emit('login', { newUser: userName });
  }
  
  function logout()
  {
    changeLoginStatus();
    socket.emit('logout', {user: currentUser});
    
    if(currentUser === users[0] || currentUser === users[1])
    {
      alert("Player logged out");
      setPlayerLogOut(true);
    }
  }
  
  function Login(props)
  {
    const loginStatus = props.isLoggedIn;
    
    if(loginStatus === 'loggedIn')
    {
      return (
        <div>
          <Board usersList={ users } playerLogOut={playerLogOut} currentUser={currentUser}/>
          
          <div className="userBox">
            {users.map((item, index) => {
              const counter = userCounter[index];
              return (
                <div key={counter}>{counter + '. ' + item}</div>
              );
            })}
            
          </div>
          <button type="button" onClick={logout}>Logout</button>
        </div>
      );
    }
    
    else
    {
      return (
        
        <div>
          <input ref={inputRef} type="text" name="name" />
          <button onClick= {logIn}>Submit</button>
        </div>
        
      );
    }
    
  }
  
  useEffect(() => {
    
    socket.on('login', (data) => {
      console.log("data: " + data.userList);
      setUsers(data['userList']);
      setUserCounter(data['userNum']);
    });
    
    socket.on('logout', (data) => {
      setUsers(data['userList']);
      setUserCounter(data['userNum']);
    });
    
  }, []);
  
  //console.log(users);
  
  return(
    <center>
      
      <Login isLoggedIn={loginStatus} />
      
    </center>
  );
  
}

export default App;