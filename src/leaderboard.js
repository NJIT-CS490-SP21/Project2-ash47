
export function Leaderboard(props)
{
    return (
      <div className="leaderBoard">
        {props.leaderBoard.map((item, index) => {
          const userScore = props.score[index];
        
          return(
            <div>{item + ' ' + userScore}</div>
          );
            
        })}
      </div>  
    );
}