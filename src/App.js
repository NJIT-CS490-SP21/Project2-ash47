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
  
  const [ emptyInput, setEmptyInput ] = useState(false);
  
  function changeLoginStatus()
  {
    setLoginStatus(currLogin => currLogin === 'loggedIn' ? 'loggedOut' : 'loggedIn');
  }
  
  function logIn()
  {
    const userName = inputRef.current.value;
    if( userName != "" )
    {
      setCurrentUser(userName);
      changeLoginStatus();
      
      socket.emit('login', { newUser: userName });
    }
    else
    {
      setEmptyInput(true);
    }
  }
  
  function logout()
  {
    changeLoginStatus();
    socket.emit('logout', {user: currentUser});
    
    if(currentUser === users[0] || currentUser === users[1])
    {
      let empty_list = [null, null, null, null, null, null, null, null, null];
      socket.emit('move', {reset: empty_list});
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
              <div>
                <div key={counter}>
                  {counter + '. ' + item}
                </div>
                {index == 1 ? <div><b>Spectators: </b></div> : <b></b>}
              </div>
              );
            })}
            
          </div>
          <Board usersList={ users } currentUser={currentUser}/>
          <div>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        </div>
      );
    }
    
  }
  
  useEffect(() => {
    
    socket.on('login', (data) => {
      //console.log("data: " + data.userList);
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