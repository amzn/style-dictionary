import React from 'react';
import Nav from './nav';

export default function(props) {
  return (
    <header className="header">
      <Nav items={props.navItems} />
    </header>
  )
}
