export const isColor = (token, options) => {
  return (options?.usesDtcg ? token.$type : token.type) === 'color';
};
