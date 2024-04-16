/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["integration output references should warn the user if filters out references briefly"] = 
`⚠️ __integration__/build/filteredVariables.css
While building filteredVariables.css, filtered out token references were found; output may be unexpected. Ignore this warning if intentional.

Use log.verbosity "verbose" or use CLI option --verbose for more details.`;
/* end snapshot integration output references should warn the user if filters out references briefly */

snapshots["integration output references should warn the user if filters out references with a detailed message when using verbose logging"] = 
`⚠️ __integration__/build/filteredVariables.css
While building filteredVariables.css, filtered out token references were found; output may be unexpected. Ignore this warning if intentional.
Here are the references that are used but not defined in the file:
color.core.neutral.100
color.core.neutral.0
color.core.neutral.200
color.core.red.0
color.core.orange.0
color.core.green.0
color.core.blue.0
This is caused when combining a filter and \`outputReferences\`.`;
/* end snapshot integration output references should warn the user if filters out references with a detailed message when using verbose logging */

snapshots["integration output references should not warn the user if filters out references is prevented with outputReferencesFilter"] = 
`
css
✔︎ __integration__/build/filteredVariables.css`;
/* end snapshot integration output references should not warn the user if filters out references is prevented with outputReferencesFilter */

snapshots["integration output references should allow using outputReferencesTransformed to not output refs when value has been transitively transformed"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --base: rgb(0,0,0);
  --referred: rgba(0,0,0,0.12);
}
`;
/* end snapshot integration output references should allow using outputReferencesTransformed to not output refs when value has been transitively transformed */

