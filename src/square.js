import React from 'react';
import PropTypes from 'prop-types';

export function Square(props) {
  const { id, value, onClick } = props;
  const textLable = '';

  function clickHandler() {
    if (value === null) {
      onClick(id);
    }
  }

  return <div role="button" tabIndex={id} className={`box ${value}`} onClick={clickHandler} onKeyDown={clickHandler}>{textLable}</div>;
}

Square.propTypes = {
  id: PropTypes.number,
  value: PropTypes.string,
  onClick: PropTypes.objectOf(PropTypes.object),
};

Square.defaultProps = {
  id: PropTypes.number,
  value: PropTypes.string,
  onClick: PropTypes.objectOf(PropTypes.object),
};

export default Square;
