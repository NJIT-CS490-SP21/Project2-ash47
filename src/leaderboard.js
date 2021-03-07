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
    <div className="lbWrap">
    <b>Leaderboard</b>
    <table className="leaderBoard">
      {leaderBoard.map((item, index) => {
        const userScore = score[index];
      
        return(
        <tr>
          <th>{(index + 1) + '. '}</th>
          <th>{item}</th>
          <th>{userScore}</th>
        </tr>
        );
          
      })}
    </table>  
    </div>
  );
}