import './App.css';
import { useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import { Board } from './Board.js';
import './Board.css';

const socket = io(); // Connects to socket connection

function App() {
  
  const inputRef = useRef(null);
  
  const [ users, setUsers ] = useState([]);
  const [ userCounter, setUserCounter ] = useState([]);
  
  const [ loginStatus, setLoginStatus ] = useState('loggedOut');
  const [ currentUser, setCurrentUser ] = useState(null);
  const [ playerLogOut, setPlayerLogOut ] = useState(false);
  
  const [ emptyInput, setEmptyInput ] = useState(false);
  console.log(emptyInput);
  
  function changeLoginStatus()
  {
    setLoginStatus(currLogin => currLogin === 'loggedIn' ? 'loggedOut' : 'loggedIn');
  }
  
  function logIn()
  {
    const userName = inputRef.current.value;
    if( userName != "" )
    {
      console.log(userName);
      setCurrentUser(userName);
      changeLoginStatus();
      setPlayerLogOut(false);
      
      socket.emit('login', { newUser: userName });
    }
    else
    {
      setEmptyInput(true);
      console.log(emptyInput);
    }
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
    
    if(loginStatus !== 'loggedIn')
    {
      return (
        
        <div>
          <input ref={inputRef} type="text" />
          {emptyInput === false ? "" : <div className="errMsg">Please enter a valid username</div>}
          <div><button onClick= {logIn}>Submit</button></div>
        </div>
        
      );
      
    }
    
    else
    {
      return (
        <div className="gameBoard">
          
          <div className="userBox">
            {users.map((item, index) => {
              const counter = userCounter[index];
              return (
                <div key={counter}>
                  {counter + '. ' + item}
                </div>
              );
            })}
            
          </div>
          <Board usersList={ users } playerLogOut={playerLogOut} currentUser={currentUser}/>
          <div>
            <button type="button" onClick={logout}>Logout</button>
          </div>
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