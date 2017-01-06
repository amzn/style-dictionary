import React from 'react';
import Color from './color';

export default function(props) {
  return (
    <div className="color-group">
      <div className="color-group-header"
           style={{background: props.color}}>
        <h3 className={`color-group-title ${props.font}`}>
          {props.title}
        </h3>
      </div>
      {props.colors.map((color, i) =>
        <Color {...color} key={color.value} />
      )}
    </div>
  )
}
