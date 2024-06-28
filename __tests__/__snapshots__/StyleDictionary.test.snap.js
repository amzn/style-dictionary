/* @web/test-runner snapshot v1 */
export const snapshots = {};
snapshots["StyleDictionary class + extend method collisions should throw an error if the collision is in source files and log is set to error"] = 
`
Token collisions detected (7):

Collision detected at: size.padding.zero! Original value: 0, New value: 0
Collision detected at: size.padding.tiny! Original value: 3, New value: 3
Collision detected at: size.padding.small! Original value: 5, New value: 5
Collision detected at: size.padding.base! Original value: 10, New value: 10
Collision detected at: size.padding.large! Original value: 15, New value: 15
Collision detected at: size.padding.xl! Original value: 20, New value: 20
Collision detected at: size.padding.xxl! Original value: 30, New value: 30

`;
/* end snapshot StyleDictionary class + extend method collisions should throw an error if the collision is in source files and log is set to error */

snapshots["StyleDictionary class + extend method collisions should throw a brief error if the collision is in source files and log is set to error and verbosity default"] = 
`
Token collisions detected (7):
Use log.verbosity "verbose" or use CLI option --verbose for more details.`;
/* end snapshot StyleDictionary class + extend method collisions should throw a brief error if the collision is in source files and log is set to error and verbosity default */

snapshots["StyleDictionary class collisions should throw an error if the collision is in source files and log is set to error"] = 
`
Token collisions detected (28):

Collision detected at: size.padding.zero! Original value: 0, New value: 0
Collision detected at: size.padding.zero! Original value: dimension, New value: dimension
Collision detected at: size.padding.zero! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.zero! Original value: true, New value: true
Collision detected at: size.padding.tiny! Original value: 3, New value: 3
Collision detected at: size.padding.tiny! Original value: dimension, New value: dimension
Collision detected at: size.padding.tiny! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.tiny! Original value: true, New value: true
Collision detected at: size.padding.small! Original value: 5, New value: 5
Collision detected at: size.padding.small! Original value: dimension, New value: dimension
Collision detected at: size.padding.small! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.small! Original value: true, New value: true
Collision detected at: size.padding.base! Original value: 10, New value: 10
Collision detected at: size.padding.base! Original value: dimension, New value: dimension
Collision detected at: size.padding.base! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.base! Original value: true, New value: true
Collision detected at: size.padding.large! Original value: 15, New value: 15
Collision detected at: size.padding.large! Original value: dimension, New value: dimension
Collision detected at: size.padding.large! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.large! Original value: true, New value: true
Collision detected at: size.padding.xl! Original value: 20, New value: 20
Collision detected at: size.padding.xl! Original value: dimension, New value: dimension
Collision detected at: size.padding.xl! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.xl! Original value: true, New value: true
Collision detected at: size.padding.xxl! Original value: 30, New value: 30
Collision detected at: size.padding.xxl! Original value: dimension, New value: dimension
Collision detected at: size.padding.xxl! Original value: __tests__/__tokens/_paddings.json, New value: __tests__/__tokens/_paddings.json
Collision detected at: size.padding.xxl! Original value: true, New value: true

`;
/* end snapshot StyleDictionary class collisions should throw an error if the collision is in source files and log is set to error */

snapshots["StyleDictionary class collisions should throw a brief error if the collision is in source files and log is set to error and verbosity default"] = 
`
Token collisions detected (28):
Use log.verbosity "verbose" or use CLI option --verbose for more details.`;
/* end snapshot StyleDictionary class collisions should throw a brief error if the collision is in source files and log is set to error and verbosity default */

snapshots["StyleDictionary class formatFile should support asynchronous formats"] = 
`:root {
  size-font-small: "12rem";
  size-font-large: "18rem";
  color-base-red: "#ff0000";
  color-white: "#ffffff";
}
`;
/* end snapshot StyleDictionary class formatFile should support asynchronous formats */

snapshots["StyleDictionary class formatFile should support asynchronous fileHeader"] = 
`/**
 * foo
 * bar
 */

:root {
  --someName: value1;
}
`;
/* end snapshot StyleDictionary class formatFile should support asynchronous fileHeader */

snapshots["StyleDictionary class formatFile name collisions should generate warning messages for output name collisions"] = 
`[38;2;255;140;0m[1m⚠️ __tests__/__output/test.collisions[22m[39m
[38;2;255;140;0m[1mWhile building [38;2;255;69;0m[1m__tests__/__output/test.collisions[22m[1m[39m[38;2;255;140;0m, token collisions were found; output may be unexpected. Ignore this warning if intentional.[22m[39m
[38;2;255;140;0m[1m    Output name [38;2;255;69;0m[1msomeName[22m[1m[39m[38;2;255;140;0m was generated by:[22m[39m
[38;2;255;140;0m[1m        [38;2;255;69;0msome.name.path1[39m[38;2;255;140;0m   [38;2;255;140;0mvalue1[39m[38;2;255;140;0m[22m[39m
[38;2;255;140;0m[1m        [38;2;255;69;0msome.name.path2[39m[38;2;255;140;0m   [38;2;255;140;0mvalue2[39m[38;2;255;140;0m[22m[39m
[38;2;255;140;0m[1m[38;2;255;165;0mThis many-to-one issue is usually caused by some combination of:[39m[38;2;255;140;0m[22m[39m
[38;2;255;140;0m[1m[38;2;255;165;0m    * conflicting or similar paths/names in token definitions[39m[38;2;255;140;0m[22m[39m
[38;2;255;140;0m[1m[38;2;255;165;0m    * platform transforms/transformGroups affecting names, especially when removing specificity[39m[38;2;255;140;0m[22m[39m
[38;2;255;140;0m[1m[38;2;255;165;0m    * overly inclusive file filters[39m[38;2;255;140;0m[22m[39m`;
/* end snapshot StyleDictionary class formatFile name collisions should generate warning messages for output name collisions */

