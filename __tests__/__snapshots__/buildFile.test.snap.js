/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["buildFile should support asynchronous formats"] = 
`:root {
  size-font-small: "12rem";
  size-font-large: "18rem";
  color-base-red: "#ff0000";
  color-white: "#ffffff";
}
`;
/* end snapshot buildFile should support asynchronous formats */

snapshots["buildFile should support asynchronous fileHeader"] = 
`/**
 * foo
 * bar
 */

:root {
  --someName: value1;
}
`;
/* end snapshot buildFile should support asynchronous fileHeader */

