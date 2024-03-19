/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["integration output references should warn the user if filters out references briefly"] = 
`⚠️ __integration__/build/filteredVariables.css
While building filteredVariables.css, filtered out token references were found; output may be unexpected. Ignore this warning if intentional.
Here are the references that are used but not defined in the file:

Use --verbose or log.verbosity: 'verbose' option for more details`;
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

