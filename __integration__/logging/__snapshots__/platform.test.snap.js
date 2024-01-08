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
Property Reference Errors:
Reference doesn't exist: color.danger.value tries to reference color.red.value, which is not defined.

Problems were found when trying to resolve property references`;
/* end snapshot integration logging platform property reference errors should throw and notify users of unknown references */

snapshots["integration logging platform property reference errors circular references should throw and notify users"] = 
`
Property Reference Errors:
Circular definition cycle:  color.foo.value, color.foo.value, color.foo.value
Circular definition cycle:  color.teal.value, color.blue.value, color.green.value, color.teal.value

Problems were found when trying to resolve property references`;
/* end snapshot integration logging platform property reference errors circular references should throw and notify users */

