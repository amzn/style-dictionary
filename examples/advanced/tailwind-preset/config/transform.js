export const rgbChannels = (token, options) => {
  const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const value = options.usesDtcg ? token.$value : token.value;

  const matches = value.match(regex);
  if (!matches) {
    throw new Error(`Value '${value}' is not a valid rgb format.`);
  }
  return `${matches[1]} ${matches[2]} ${matches[3]}`;
};
