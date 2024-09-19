export const rgbChannels = (token) => {
  const regex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;
  const matches = token.value.match(regex);
  if (!matches) {
    throw new Error(`Value '${token.value}' is not a valid rgb format.`);
  }
  return `${matches[1]} ${matches[2]} ${matches[3]}`;
};
