import React from 'react';
import keys from 'lodash/keys';
import capitalize from 'lodash/capitalize';
import styleDictionary from '../styleDictionary/properties';
import ColorGroup from '../components/colorGroup';

const colorGroups = keys(styleDictionary.color.base)
  .filter((color_group) => {
    return color_group !== 'white' && color_group !== 'black'
  })
  .map((color_group) => {
    return {
      title:  capitalize(color_group.replace('_', ' ')),
      color:  styleDictionary.color.base[color_group]['500'].value,
      font:   styleDictionary.color.base[color_group]['500'].attributes.font,
      colors: keys(styleDictionary.color.base[color_group]).map((color) => {
        let prop = styleDictionary.color.base[color_group][color];
        return {
          value: prop.value,
          item:  color,
          font:  prop.attributes.font
        }
      })
    }
  });

function prettyReference(ref) {
  return ref.replace(/{|}/g, '').replace('value','');
}

const fontColors = keys(styleDictionary.color.font)
  .filter((fontColor) => {
    return !['inverse','button'].includes(fontColor)
  })
  .map((fontColor) => {
    return {
      name: fontColor,
      value: prettyReference(styleDictionary.color.font[fontColor].original.value)
    }
  });


export default function() {
  return (
    <div>
      <h1>Colors!</h1>
      {colorGroups.map((colorGroup) =>
        <ColorGroup {...colorGroup} key={colorGroup.title} />
      )}
      {fontColors.map((fontColor) =>
        <div key={fontColor.name}>{fontColor.name}: {fontColor.value}</div>
      )}
    </div>
  )
}
