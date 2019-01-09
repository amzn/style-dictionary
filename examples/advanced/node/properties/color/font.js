const core = require('./core');

module.exports = {
  // Both of these work
  base: core.grey['100'],
  secondary: { value: "{color.core.grey.80.value}" },
  link: { value: "{color.brand.primary.base.value}" },
  inverse: {
    base: { value: "#fff" }
  }
  // This does not work (because of the way the build system does reference resolution):
  // tertiary: "{color.core.grey.60}"
}