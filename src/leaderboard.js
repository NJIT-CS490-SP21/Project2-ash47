import { useState, useRef, useEffect } from 'react';
export function Leaderboard(props)
{
  const [ leaderBoard, setLeaderBoard ] = useState([]);
  const [ score, setScore ] = useState([]);
  
  useEffect(() => {
    props.socket.on('update_score', (data) => {
      setLeaderBoard(prevList => prevList = data.users);
      setScore(prevList => prevList = data.score);
    });
  }, []);
  
  return (
    <div className="leaderBoard">
      {leaderBoard.map((item, index) => {
        const userScore = score[index];
      
        return(
          <div>{item + ' ' + userScore}</div>
        );
          
      })}
    </div>  
  );
}