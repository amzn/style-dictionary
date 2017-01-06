import React from 'react';
import keys from 'lodash/keys';
import capitalize from 'lodash/capitalize';
import styleDictionary from '../styleDictionary/properties';
import Icon from '../components/icon';

const icons = keys(styleDictionary.content.icon)
  .map((icon) => {
    return {
      name: capitalize(icon.replace('_', ' ')),
      icon: styleDictionary.content.icon[icon].value
    }
  });


export default function() {
  return (
    <div>
      <h1>Icons!</h1>
      {icons.map((icon) =>
        <Icon {...icon} key={icon.name} />
      )}
    </div>
  )
}
