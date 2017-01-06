import React from 'react';
import keys from 'lodash/keys';
import styleDictionary from '../styleDictionary/properties';
import Nav from './nav';
import Header from './header';

export default function(props) {
  return (
    <div>
      <Header navItems={keys(styleDictionary)} />
      {props.children}
    </div>
  )
}
