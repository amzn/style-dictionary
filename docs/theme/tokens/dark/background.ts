export const background = {
  primary: { $value: '{color.core.grey.100}' },
  secondary: { $value: '{color.core.grey.90}' },
  tertiary: { $value: '{color.core.grey.80}' },
  quaternary: { $value: '{color.core.grey.60}' },

  badge: { $value: '{color.core.teal.darker}' },
  debug: { $value: '{color.core.purple.dark}' },

  danger: { $value: '{color.core.red.light}' },
  warning: { $value: '{color.core.orange.light}' },
  success: { $value: '{color.core.green.light}' },
  info: { $value: '{color.core.teal.light}' },

  interactive: {
    base: { $value: '{color.core.pink.dark}', modify: { alpha: 0.4 } },
    hover: { $value: '{color.core.pink.dark}', modify: { alpha: 0.6 } },
  },

  drop: { $value: '{color.background.selection.secondary.active}' },

  selection: {
    primary: {
      active: { $value: '{color.core.pink.light}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.pink.light}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { $value: '{color.core.teal.light}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.teal.light}', modify: { alpha: 0.2 } },
    },
    tertiary: {
      active: { $value: '{color.core.purple.light}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.purple.light}', modify: { alpha: 0.2 } },
    },
  },

  highlight: {
    primary: {
      active: { $value: '{color.core.yellow.light}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.yellow.light}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { $value: '{color.core.blue.light}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.blue.light}', modify: { alpha: 0.2 } },
    },
  },
};
