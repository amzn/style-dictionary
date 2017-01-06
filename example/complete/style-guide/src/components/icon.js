import React from 'react';

export default function(props) {
  return (
    <div className="icon-example">
      <span>{props.name}</span>
      <span className="icon">{props.icon}</span>
    </div>
  )
}
