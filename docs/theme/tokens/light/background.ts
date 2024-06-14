export const background = {
  primary: { value: '#FFFFFF' },
  secondary: { value: '{color.core.grey.5.value}' },
  tertiary: { value: '{color.core.grey.10.value}' },
  quaternary: { value: '{color.core.grey.20.value}' },

  badge: { value: '{color.core.teal.light.value}' },
  debug: { value: '{color.core.purple.light.value}' },

  danger: { value: '{color.core.red.darker.value}' },
  warning: { value: '{color.core.orange.darker.value}' },
  success: { value: '{color.core.green.darker.value}' },
  info: { value: '{color.core.teal.darker.value}' },

  interactive: {
    base: { value: '{color.core.pink.light.value}', modify: { alpha: 0.4 } },
    hover: { value: '{color.core.pink.light.value}', modify: { alpha: 0.6 } },
  },

  drop: { value: '{color.background.selection.secondary.active.value}' },

  selection: {
    primary: {
      active: { value: '{color.core.pink.dark.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.pink.dark.value}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { value: '{color.core.teal.dark.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.teal.dark.value}', modify: { alpha: 0.2 } },
    },
    tertiary: {
      active: { value: '{color.core.purple.dark.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.purple.dark.value}', modify: { alpha: 0.2 } },
    },
  },

  highlight: {
    primary: {
      active: { value: '{color.core.yellow.dark.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.yellow.dark.value}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { value: '{color.core.blue.dark.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.blue.dark.value}', modify: { alpha: 0.2 } },
    },
  },
};
