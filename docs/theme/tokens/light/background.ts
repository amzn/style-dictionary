export const background = {
  primary: { $value: '#FFFFFF' },
  secondary: { $value: '{color.core.grey.5}' },
  tertiary: { $value: '{color.core.grey.10}' },
  quaternary: { $value: '{color.core.grey.20}' },

  badge: { $value: '{color.core.teal.light}' },
  debug: { $value: '{color.core.purple.light}' },

  danger: { $value: '{color.core.red.darker}' },
  warning: { $value: '{color.core.orange.darker}' },
  success: { $value: '{color.core.green.darker}' },
  info: { $value: '{color.core.teal.darker}' },

  interactive: {
    base: { $value: '{color.core.pink.light}', modify: { alpha: 0.4 } },
    hover: { $value: '{color.core.pink.light}', modify: { alpha: 0.6 } },
  },

  drop: { $value: '{color.background.selection.secondary.active}' },

  selection: {
    primary: {
      active: { $value: '{color.core.pink.dark}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.pink.dark}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { $value: '{color.core.teal.dark}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.teal.dark}', modify: { alpha: 0.2 } },
    },
    tertiary: {
      active: { $value: '{color.core.purple.dark}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.purple.dark}', modify: { alpha: 0.2 } },
    },
  },

  highlight: {
    primary: {
      active: { $value: '{color.core.yellow.dark}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.yellow.dark}', modify: { alpha: 0.2 } },
    },
    secondary: {
      active: { $value: '{color.core.blue.dark}', modify: { alpha: 0.4 } },
      inactive: { $value: '{color.core.blue.dark}', modify: { alpha: 0.2 } },
    },
  },
};
