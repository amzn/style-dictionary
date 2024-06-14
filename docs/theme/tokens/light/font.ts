export const font = {
  primary: { value: '{color.core.grey.100.value}' },
  secondary: { value: '{color.core.grey.100.value}', modify: { alpha: 0.8 } },
  tertiary: { value: '{color.core.grey.100.value}', modify: { alpha: 0.6 } },
  quaternary: { value: '{color.core.grey.100.value}', modify: { alpha: 0.4 } },
  ghost: { value: '{color.core.grey.100.value}', modify: { alpha: 0.2 } },
  inverse: { value: '{color.background.primary.value}' },

  active: { value: '{color.core.pink.darker.value}' },
  success: { value: '{color.core.green.darker.value}' },
  danger: { value: '{color.core.red.darker.value}' },
  warning: { value: '{color.core.orange.darker.value}' },
  info: { value: '{color.core.teal.darker.value}' },

  link: {
    primary: {
      active: { value: '{color.core.teal.darker.value}' },
      inactive: { value: '{color.core.teal.darker.value}', modify: { alpha: 0.8 } },
    },
    secondary: {
      active: { value: '{color.core.pink.darker.value}' },
      inactive: { value: '{color.core.pink.darker.value}', modify: { alpha: 0.8 } },
    },
  },

  code: {
    '1': { value: '{color.core.red.dark.value}' },
    '2': { value: '{color.core.orange.dark.value}' },
    '3': { value: '{color.core.yellow.dark.value}' },
    '4': { value: '{color.core.lime.dark.value}' },
    '5': { value: '{color.core.green.dark.value}' },
    '6': { value: '{color.core.teal.dark.value}' },
    '7': { value: '{color.core.blue.dark.value}' },
    '8': { value: '{color.core.purple.dark.value}' },
    '9': { value: '{color.core.pink.dark.value}' },

    '21': { value: '{color.core.red.darker.value}' },
    '22': { value: '{color.core.orange.darker.value}' },
    '23': { value: '{color.core.yellow.darker.value}' },
    '24': { value: '{color.core.lime.darker.value}' },
    '25': { value: '{color.core.green.darker.value}' },
    '26': { value: '{color.core.teal.darker.value}' },
    '27': { value: '{color.core.blue.darker.value}' },
    '28': { value: '{color.core.purple.darker.value}' },
    '29': { value: '{color.core.pink.darker.value}' },
  },
};
