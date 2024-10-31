/**
 * These care colors specific to the Starlight Astro docs package
 */
export const starlight = {
  accent: {
    low: { $value: '{color.teal.low}' },
    _: { $value: '{color.teal._}' },
    high: { $value: '{color.teal.high}' },
  },
  bg: {
    nav: { $value: '{color.background.primary}' },
    sidebar: { $value: '{color.background.secondary}' },
    _: { $value: '{color.background.secondary}' },
    code: { $value: '{color.black}' },
    inline_code: { $value: '{color.background.tertiary}' },
  },
  hairline: {
    shade: { $value: '{color.border.tertiary}' },
    _: { $value: '{color.border.secondary}' },
    light: { $value: '{color.border.tertiary}' },
  },
};
