import React from 'react';
import PropTypes from 'prop-types';

export function UserBox(props) {
  const { users, userCounter } = props;

  return (
    <div className="userBox">
      <h1 className="user_h1">User list</h1>
      <div className="usersList">
        {users.map((item, index) => {
          const counter = userCounter[index];

          return (
            <div>
              {index === 0 ? (
                <div key={counter}>
                  <b>
                    <p>{`${counter}. ${item} X`}</p>
                  </b>
                </div>
              ) : (
                [
                  index === 1 ? (
                    <div key={counter}>
                      <b>
                        <p>{`${counter}. ${item} O`}</p>
                      </b>
                    </div>
                  ) : (
                    <div key={counter}>
                      <p>{`${counter}. ${item}`}</p>
                    </div>
                  ),
                ]
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

UserBox.propTypes = {
  users: PropTypes.arrayOf(PropTypes.string),
  userCounter: PropTypes.arrayOf(PropTypes.number),
};
UserBox.defaultProps = {
  users: PropTypes.arrayOf(PropTypes.string),
  userCounter: PropTypes.arrayOf(PropTypes.number),
};

export default UserBox;
