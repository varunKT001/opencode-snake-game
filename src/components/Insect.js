import React from 'react';

export default function Insect({ insectPosition }) {
  //insectPosition => {left: Number, top: Number}
  const styles = {
    left: `${insectPosition.left}%`,
    top: `${insectPosition.top}%`,
  };
  return <div className='insect-cordinate' style={styles}></div>;
}
