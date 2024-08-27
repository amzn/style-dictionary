/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["integration logging platform should throw and notify users of unknown actions"] = 
`Cannot read properties of undefined (reading 'undo')`;
/* end snapshot integration logging platform should throw and notify users of unknown actions */

snapshots["integration logging platform should throw and notify users of unknown transforms"] = 
`
Unknown transforms "foo", "bar" found in platform "css":
None of "foo", "bar" match the name of a registered transform.
`;
/* end snapshot integration logging platform should throw and notify users of unknown transforms */

snapshots["integration logging platform should throw and notify users of unknown transformGroups"] = 
`
Unknown transformGroup "foo" found in platform "css":
"foo" does not match the name of a registered transformGroup.
`;
/* end snapshot integration logging platform should throw and notify users of unknown transformGroups */
snapshots["integration logging platform property reference errors should throw and notify users of unknown references"] = 
`
Reference Errors:
Some token references (1) could not be found.
Use log.verbosity "verbose" or use CLI option --verbose for more details.
Refer to: https://styledictionary.com/reference/logging/
`;
/* end snapshot integration logging platform property reference errors should throw and notify users of unknown references */

snapshots["integration logging platform property reference errors circular references should throw and notify users"] = 
`
Reference Errors:
Some token references (2) could not be found.
Use log.verbosity "verbose" or use CLI option --verbose for more details.
Refer to: https://styledictionary.com/reference/logging/
`;
/* end snapshot integration logging platform property reference errors circular references should throw and notify users */

