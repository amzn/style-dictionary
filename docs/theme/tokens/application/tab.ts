export const tab = {
  border: { $value: '{color.border.tertiary}' },

  activeBackground: { $value: '{color.background.primary}' },
  activeForeground: { $value: '{color.font.primary}' },
  activeBorderTop: { $value: '{color.border.focus}' },

  inactiveBackground: { $value: '{color.background.tertiary}' },
  inactiveForeground: { $value: '{color.font.tertiary}' },

  // Unfocused tabs are ones in the inactive editor group
  unfocusedActiveBorder: {},
  unfocusedHoverBorder: { $value: '{color.border.active}' },
  unfocusedActiveForeground: { $value: '{color.font.secondary}' },
  unfocusedInactiveForeground: { $value: '{color.font.tertiary}' },
};
