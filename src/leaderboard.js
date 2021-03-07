import { useState, useEffect } from 'react';
export function Leaderboard(props)
{
  const [ leaderBoard, setLeaderBoard ] = useState([]);
  const [ score, setScore ] = useState([]);
  
  useEffect(() => {
    props.socket.emit('get_leader_board', {user: props.currentUser});
    
    props.socket.on('update_score', (data) => {
      setLeaderBoard(prevList => prevList = data.users);
      setScore(prevList => prevList = data.score);
    });
  }, []);
  
  return (
    <table className="leaderBoard">
      {leaderBoard.map((item, index) => {
        const userScore = score[index];
      
        return(
        <tr>
          <div>{(index + 1) + '. '}</div>
          <div>{item}</div>
          <div>{userScore}</div>
        </tr>
        );
          
      })}
    </table>  
  );
}