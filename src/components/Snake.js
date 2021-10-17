import React from 'react';

export default function Snake({ snakePosition }) {
  //position => array of arrays
  //array[i] => {left: Number, top: Number}
  console.log('here');
  return snakePosition.map((pos, i) => {
    let styles = {
      left: `${pos.left}%`,
      top: `${pos.top}%`,
    };
    return <div key={i} className='snake-cordinate' style={styles}></div>;
  });
}
