module.exports = {
  spaceSeparatedRgb: (token) => {
    const rgb = token.value
      .replace("rgb(", "")
      .replace(")", "")
      .split(", ")
      .join(" ");
    return rgb;
  },
};
