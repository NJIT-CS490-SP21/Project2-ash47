
export function UserBox(props)
{
    return (
      <div className="userBox">
        <h1 className='user_h1'>User list</h1>
        <div className="usersList">
          {props.users.map((item, index) => {
            const counter = props.userCounter[index];
            
            return (
            <div>
              {index == 0 ? 
                <div key={counter}><b><p>
                  {counter + '. ' + item + ' X'}
                </p></b></div> : 
                [index == 1 ?
                  
                <div key={counter}><b><p>
                  {counter + '. ' + item + ' O'}
                </p></b></div>:
                  
                <div key={counter}><p>
                  {counter + '. ' + item}
                </p></div>
                
                ]
              }
            </div>
            );
          })}
        </div>
      </div>  
    );
}