export const font = {
  primary: { $value: '#FFFFFFEE' },
  secondary: { $value: '#FFFFFFBB' },
  tertiary: { $value: '#FFFFFF99' },
  quaternary: { $value: '#FFFFFF66' },
  ghost: { $value: '#FFFFFF44' },
  inverse: { $value: '{color.background.primary}' },

  active: { $value: '{color.core.pink.light}' },
  success: { $value: '{color.core.green.light}' },
  danger: { $value: '{color.core.red.light}' },
  warning: { $value: '{color.core.orange.light}' },
  info: { $value: '{color.core.teal.light}' },

  link: {
    primary: {
      active: { $value: '{color.core.teal.light}' },
      inactive: { $value: '{color.core.teal.light}', modify: { alpha: 0.8 } },
    },
    secondary: {
      active: { $value: '{color.core.pink.light}' },
      inactive: { $value: '{color.core.pink.light}', modify: { alpha: 0.8 } },
    },
  },

  code: {
    '1': { $value: '{color.core.red.lighter}' },
    '2': { $value: '{color.core.orange.lighter}' },
    '3': { $value: '{color.core.yellow.lighter}' },
    '4': { $value: '{color.core.lime.lighter}' },
    '5': { $value: '{color.core.green.lighter}' },
    '6': { $value: '{color.core.teal.lighter}' },
    '7': { $value: '{color.core.blue.lighter}' },
    '8': { $value: '{color.core.purple.lighter}' },
    '9': { $value: '{color.core.pink.lighter}' },

    '21': { $value: '{color.core.red.light}' },
    '22': { $value: '{color.core.orange.light}' },
    '23': { $value: '{color.core.yellow.light}' },
    '24': { $value: '{color.core.lime.light}' },
    '25': { $value: '{color.core.green.light}' },
    '26': { $value: '{color.core.teal.light}' },
    '27': { $value: '{color.core.blue.light}' },
    '28': { $value: '{color.core.purple.light}' },
    '29': { $value: '{color.core.pink.light}' },
  },
};
