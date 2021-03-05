
export function UserBox(props)
{
    return (
      <div className="userBox">
        {props.users.map((item, index) => {
          const counter = props.userCounter[index];
          
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
    );
}