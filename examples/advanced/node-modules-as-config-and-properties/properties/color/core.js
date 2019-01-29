const Color = require('tinycolor2');

// If you wanted to, you could generate the color ramp with base colors.
// You get less control over specific color values,
// but it might be more clean to do it this way.
const baseColors = {
  red:    {h: 4,   s: 62, v: 90},
  purple: {h: 262, s: 47, v: 65},
  blue:   {h: 206, s: 70, v: 85},
  teal:   {h: 178, s: 75, v: 80},
  green:  {h: 119, s: 47, v: 73},
  yellow: {h: 45,  s: 70, v: 95},
  orange: {h: 28,  s: 76, v: 98},
  grey:   {h: 240, s: 14, v: 35},
}

// Use a reduce function to take the array of keys in baseColor
// and map them to an object with the same keys.
module.exports = Object.keys(baseColors).reduce((ret, color) => {
  return Object.assign({}, ret, {
    [color]: {
      "20":  { value: Color(baseColors[color]).lighten(30).toString()},
      "40":  { value: Color(baseColors[color]).lighten(25).toString()},
      "60":  { value: Color(baseColors[color]).lighten(20).toString()},
      "80":  { value: Color(baseColors[color]).lighten(10).toString()},
      "100": { value: baseColors[color]},
      "120": { value: Color(baseColors[color]).darken(10).toString()},
      "140": { value: Color(baseColors[color]).darken(20).toString()}
    }
  })
}, {});