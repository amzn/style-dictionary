export const background = {
  primary: { value: '{color.core.grey.100.value}' },
  secondary: { value: '{color.core.grey.90.value}' },
  tertiary: { value: '{color.core.grey.80.value}' },
  quaternary: { value: '{color.core.grey.60.value}' },

  badge: { value: '{color.core.teal.darker.value}' },
  debug: { value: '{color.core.purple.dark.value}' },

  danger: { value: '{color.core.red.light.value}' },
  warning: { value: '{color.core.orange.light.value}' },
  success: { value: '{color.core.green.light.value}' },
  info: { value: '{color.core.teal.light.value}' },

  interactive: {
    base: { value: '{color.core.pink.dark.value}', modify: { alpha: 0.4 } },
    hover: { value: '{color.core.pink.dark.value}', modify: { alpha: 0.6 } },
  },

  drop: { value: '{color.background.selection.secondary.active.value}' },

  selection: {
    primary: {
      active: { value: '{color.core.pink.light.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.pink.light.value}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { value: '{color.core.teal.light.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.teal.light.value}', modify: { alpha: 0.2 } },
    },
    tertiary: {
      active: { value: '{color.core.purple.light.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.purple.light.value}', modify: { alpha: 0.2 } },
    },
  },

  highlight: {
    primary: {
      active: { value: '{color.core.yellow.light.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.yellow.light.value}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { value: '{color.core.blue.light.value}', modify: { alpha: 0.4 } },
      inactive: { value: '{color.core.blue.light.value}', modify: { alpha: 0.2 } },
    },
  },
};
