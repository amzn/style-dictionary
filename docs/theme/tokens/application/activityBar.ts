// The Activity Bar is displayed either on the far left or right of the workbench
// and allows fast switching between views of the Side Bar.
export const activityBar = {
  background: { $value: '{color.background.tertiary}' },
  // Drag and drop feedback color for the Activity Bar items
  dropBackground: { $value: '{color.background.drop}' },
  foreground: { $value: '{color.font.link.secondary.active}' },
  border: {},
};

export const activityBarBadge = {
  background: { $value: '{color.background.badge}' },
  foreground: { $value: '{color.font.primary}' },
};
