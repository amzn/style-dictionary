import React from 'react';
import keys from 'lodash/keys';
import styleDictionary from '../style-dictionary/properties';
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
