/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats javascript/umd should be a valid JS file and match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else if (typeof exports === "object") {
    exports["_styleDictionary"] = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root["_styleDictionary"] = factory();
  }
}(this, function() {
  return {
  "color": {
    "red": {
      "value": "#FF0000"
    }
  }
};
}))
`;
/* end snapshot formats javascript/umd should be a valid JS file and match snapshot */

