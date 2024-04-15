/**
 * @typedef {import('../../../../types/DesignToken.d.ts').TransformedTokens} TransformedTokens
 * @param {TransformedTokens} tokens
 */
export default (tokens) =>
  `${Object.values((tokens && tokens.asset && tokens.asset.font) || {}).map((font) => {
    let fileFormatArr = [];
    if (font.eot) {
      fileFormatArr.push(
        "url('../" +
          font.eot.value +
          "');\n\tsrc: url('../" +
          font.eot.value +
          "?#iefix') format('embedded-opentype')",
      );
    }
    if (font.otf) {
      fileFormatArr.push("url('../" + font.otf.value + "') format('otf')");
    }
    if (font.ttf) {
      fileFormatArr.push("url('../" + font.ttf.value + "') format('truetype')");
    }
    if (font.svg) {
      fileFormatArr.push(
        "url('../" +
          font.svg.value +
          '#' +
          font.name.value.replace(/ /g, '%20') +
          "') format('svg')",
      );
    }
    if (font.woff) {
      fileFormatArr.push("url('../" + font.woff.value + "') format('woff')");
    }
    if (font.woff2) {
      fileFormatArr.push("url('../" + font.woff2.value + "') format('woff2')");
    }

    return `@font-face {
  font-family: "${font.name.value}";
  src: ${fileFormatArr.join(',\n\t\t')};
${font.style ?? `\n  font-style: ${font.style.value};`}${
      font.weight ?? `\n  font-weight: ${font.weight.value};`
    }}`;
  })}`;
