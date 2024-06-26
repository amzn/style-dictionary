export const font = {
  primary: { $value: '{color.core.grey.100}' },
  secondary: { $value: '{color.core.grey.100}', modify: { alpha: 0.8 } },
  tertiary: { $value: '{color.core.grey.100}', modify: { alpha: 0.6 } },
  quaternary: { $value: '{color.core.grey.100}', modify: { alpha: 0.4 } },
  ghost: { $value: '{color.core.grey.100}', modify: { alpha: 0.2 } },
  inverse: { $value: '{color.background.primary}' },

  active: { $value: '{color.core.pink.darker}' },
  success: { $value: '{color.core.green.darker}' },
  danger: { $value: '{color.core.red.darker}' },
  warning: { $value: '{color.core.orange.darker}' },
  info: { $value: '{color.core.teal.darker}' },

  link: {
    primary: {
      active: { $value: '{color.core.teal.darker}' },
      inactive: { $value: '{color.core.teal.darker}', modify: { alpha: 0.8 } },
    },
    secondary: {
      active: { $value: '{color.core.pink.darker}' },
      inactive: { $value: '{color.core.pink.darker}', modify: { alpha: 0.8 } },
    },
  },

  code: {
    '1': { $value: '{color.core.red.dark}' },
    '2': { $value: '{color.core.orange.dark}' },
    '3': { $value: '{color.core.yellow.dark}' },
    '4': { $value: '{color.core.lime.dark}' },
    '5': { $value: '{color.core.green.dark}' },
    '6': { $value: '{color.core.teal.dark}' },
    '7': { $value: '{color.core.blue.dark}' },
    '8': { $value: '{color.core.purple.dark}' },
    '9': { $value: '{color.core.pink.dark}' },

    '21': { $value: '{color.core.red.darker}' },
    '22': { $value: '{color.core.orange.darker}' },
    '23': { $value: '{color.core.yellow.darker}' },
    '24': { $value: '{color.core.lime.darker}' },
    '25': { $value: '{color.core.green.darker}' },
    '26': { $value: '{color.core.teal.darker}' },
    '27': { $value: '{color.core.blue.darker}' },
    '28': { $value: '{color.core.purple.darker}' },
    '29': { $value: '{color.core.pink.darker}' },
  },
};
