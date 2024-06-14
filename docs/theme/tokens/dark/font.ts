export const font = {
  primary: { value: '#FFFFFFEE' },
  secondary: { value: '#FFFFFFBB' },
  tertiary: { value: '#FFFFFF99' },
  quaternary: { value: '#FFFFFF66' },
  ghost: { value: '#FFFFFF44' },
  inverse: { value: '{color.background.primary.value}' },

  active: { value: '{color.core.pink.light.value}' },
  success: { value: '{color.core.green.light.value}' },
  danger: { value: '{color.core.red.light.value}' },
  warning: { value: '{color.core.orange.light.value}' },
  info: { value: '{color.core.teal.light.value}' },

  link: {
    primary: {
      active: { value: '{color.core.teal.light.value}' },
      inactive: { value: '{color.core.teal.light.value}', modify: { alpha: 0.8 } },
    },
    secondary: {
      active: { value: '{color.core.pink.light.value}' },
      inactive: { value: '{color.core.pink.light.value}', modify: { alpha: 0.8 } },
    },
  },

  code: {
    '1': { value: '{color.core.red.lighter.value}' },
    '2': { value: '{color.core.orange.lighter.value}' },
    '3': { value: '{color.core.yellow.lighter.value}' },
    '4': { value: '{color.core.lime.lighter.value}' },
    '5': { value: '{color.core.green.lighter.value}' },
    '6': { value: '{color.core.teal.lighter.value}' },
    '7': { value: '{color.core.blue.lighter.value}' },
    '8': { value: '{color.core.purple.lighter.value}' },
    '9': { value: '{color.core.pink.lighter.value}' },

    '21': { value: '{color.core.red.light.value}' },
    '22': { value: '{color.core.orange.light.value}' },
    '23': { value: '{color.core.yellow.light.value}' },
    '24': { value: '{color.core.lime.light.value}' },
    '25': { value: '{color.core.green.light.value}' },
    '26': { value: '{color.core.teal.light.value}' },
    '27': { value: '{color.core.blue.light.value}' },
    '28': { value: '{color.core.purple.light.value}' },
    '29': { value: '{color.core.pink.light.value}' },
  },
};
