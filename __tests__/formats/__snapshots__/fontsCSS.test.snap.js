/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats fonts/css should produce a valid css font-face declaration without weight or style defined"] = 
`@font-face {
  font-family: "font";
  src: url('../font.ttf') format('truetype');
}`;
/* end snapshot formats fonts/css should produce a valid css font-face declaration without weight or style defined */

snapshots["formats fonts/css should produce a valid css font-face declaration with a weight defined"] = 
`@font-face {
  font-family: "font";
  src: url('../font.ttf') format('truetype');
  font-weight: 400;
}`;
/* end snapshot formats fonts/css should produce a valid css font-face declaration with a weight defined */

snapshots["formats fonts/css should produce a valid css font-face declaration with a style defined"] = 
`@font-face {
  font-family: "font";
  src: url('../font.ttf') format('truetype');
  font-style: normal;
}`;
/* end snapshot formats fonts/css should produce a valid css font-face declaration with a style defined */

snapshots["formats fonts/css should produce a valid css font-face declaration with both style and weight defined"] = 
`@font-face {
  font-family: "font";
  src: url('../font.ttf') format('truetype');
  font-style: normal;
  font-weight: 400;
}`;
/* end snapshot formats fonts/css should produce a valid css font-face declaration with both style and weight defined */

