import React from 'react';
import PropTypes from 'prop-types';

export function WinLine(props) {
  const { WinnerCombo } = props;
  if (WinnerCombo === null) {
    return <div />;
  }
  if (
    WinnerCombo[0] === 0
      && WinnerCombo[1] === 1
      && WinnerCombo[2] === 2
  ) {
    return <div className="winner_wrap r1" />;
  }
  if (
    WinnerCombo[0] === 3
      && WinnerCombo[1] === 4
      && WinnerCombo[2] === 5
  ) {
    return <div className="winner_wrap r2" />;
  }
  if (
    WinnerCombo[0] === 6
      && WinnerCombo[1] === 7
      && WinnerCombo[2] === 8
  ) {
    return <div className="winner_wrap r3" />;
  }
  if (
    WinnerCombo[0] === 0
      && WinnerCombo[1] === 3
      && WinnerCombo[2] === 6
  ) {
    return <div className="winner_wrap c1" />;
  }
  if (
    WinnerCombo[0] === 1
      && WinnerCombo[1] === 4
      && WinnerCombo[2] === 7
  ) {
    return <div className="winner_wrap c2" />;
  }
  if (
    WinnerCombo[0] === 2
      && WinnerCombo[1] === 5
      && WinnerCombo[2] === 8
  ) {
    return <div className="winner_wrap c3" />;
  }
  if (
    WinnerCombo[0] === 0
      && WinnerCombo[1] === 4
      && WinnerCombo[2] === 8
  ) {
    return <div className="winner_wrap fsl" />;
  }
  if (
    WinnerCombo[0] === 2
      && WinnerCombo[1] === 4
      && WinnerCombo[2] === 6
  ) {
    return <div className="winner_wrap bsl" />;
  }
  return <div className="winner_wrap" />;
}

WinLine.propTypes = {
  WinnerCombo: PropTypes.arrayOf(PropTypes.number),
};

WinLine.defaultProps = {
  WinnerCombo: PropTypes.arrayOf(PropTypes.number),
};

export default WinLine;
