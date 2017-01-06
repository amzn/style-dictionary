import React from 'react';

export default function(props) {
  return (
    <div className={`color ${props.font||''}`}
         style={{background: props.value}}>
      <div className="color-title">{props.item}</div>
      <div className="color-value">{props.value}</div>
    </div>
  )
}
