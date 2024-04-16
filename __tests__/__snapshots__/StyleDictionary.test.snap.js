/* @web/test-runner snapshot v1 */
export const snapshots = {};
snapshots["StyleDictionary class + extend method should throw an error if the collision is in source files and log is set to error"] = 
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
/* end snapshot StyleDictionary class + extend method should throw an error if the collision is in source files and log is set to error */

snapshots["StyleDictionary class + extend method should throw a brief error if the collision is in source files and log is set to error and verbosity default"] = 
`
Token collisions detected (7):
Use log.verbosity "verbose" or use CLI option --verbose for more details.`;
/* end snapshot StyleDictionary class + extend method should throw a brief error if the collision is in source files and log is set to error and verbosity default */

