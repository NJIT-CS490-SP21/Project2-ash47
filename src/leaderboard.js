import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

export function Leaderboard(props) {
  const [leaderBoard, setLeaderBoard] = useState([]);
  const [score, setScore] = useState([]);

  const [showLB, setShowLB] = useState(false);

  function showLDBoard() {
    setShowLB((prevStat) => (prevStat !== true));
    if (showLB === true) {
      const background = document.getElementById('gameBoard');
      background.style.filter = 'none';
    } else {
      const background = document.getElementById('gameBoard');
      background.style.filter = 'blur(5px)';
    }
  }

  useEffect(() => {
    props.socket.emit('get_leader_board', { user: props.currentUser });

    props.socket.on('update_score', (data) => {
      setLeaderBoard(() => data.users);
      setScore(() => data.score);
    });
  }, []);

  return (
    <div>
      {showLB === false ? (
        <button className="button lb" type="button" onClick={showLDBoard}>
          Show Leaderboard
        </button>
      ) : (
        <button className="button lb" type="button" onClick={showLDBoard}>
          Hide Leaderboard
        </button>
      )}
      {showLB === true ? (
        <div className="lbWrap">
          <h2>Leaderboard</h2>
          <div className="lb_list_wrap">
            <table className="leaderBoard">
              {leaderBoard.map((item, index) => {
                const userScore = score[index];
                return (
                  <tr>
                    <th>{`${index + 1}. `}</th>
                    <th>{item}</th>
                    <th>{userScore}</th>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}

Leaderboard.propTypes = {
  currentUser: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.object),
};

Leaderboard.defaultProps = {
  currentUser: PropTypes.string,
  socket: PropTypes.objectOf(PropTypes.object),
};

export default Leaderboard;
