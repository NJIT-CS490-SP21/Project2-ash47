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
        
        <div className="wrap">
          <div className="loginBox">
            <div className="heading">Welcome to my app..!!</div>
            <h3>Please enter your username to login</h3>
            <br></br>
            <br></br>
            <input className="input" ref={inputRef} type="text" placeholder="User name...."/>
            {emptyInput === false ? "" : <div className="errMsg">Please enter a valid username</div>}
            <br></br>
            <div><button className="button" type="submit" onClick= {logIn}>Submit</button></div>
          </div>
        </div>
        
      );
      
    }
    
    else
    {
      return (
        <div className="wrap">
        <div className="gameBoard">
          
          <div className="userBox">
            {users.map((item, index) => {
              const counter = userCounter[index];
              
              return (
              <div>
                {index == 0 ? <div><b>Players: </b></div> : <b></b>}
                <div key={counter}>
                  {counter + '. ' + item}
                </div>
                {index == 1 ? <div><br></br><b>Spectators: </b></div> : <b></b>}
              </div>
              );
            })}
            
          </div>
          <Board usersList={ users } currentUser={currentUser}/>
          <div className="logOutbtn">
            <button className="button" type="button" onClick={logout}>Logout</button>
          </div>
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