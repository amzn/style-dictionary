/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["integration showFileHeader without platform options should show file header if no file options set"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --size-padding-small: 0.5rem;
  --size-padding-medium: 1rem;
  --size-padding-large: 1rem;
  --size-padding-xl: 1rem;
}
`;
/* end snapshot integration showFileHeader without platform options should show file header if no file options set */

snapshots["integration showFileHeader without platform options should not show file header if file options set to false"] = 
`:root {
  --size-padding-small: 0.5rem;
  --size-padding-medium: 1rem;
  --size-padding-large: 1rem;
  --size-padding-xl: 1rem;
}
`;
/* end snapshot integration showFileHeader without platform options should not show file header if file options set to false */

snapshots["integration showFileHeader with platform options set to false should not show file header if no file options set"] = 
`:root {
  --size-padding-small: 0.5rem;
  --size-padding-medium: 1rem;
  --size-padding-large: 1rem;
  --size-padding-xl: 1rem;
}
`;
/* end snapshot integration showFileHeader with platform options set to false should not show file header if no file options set */

snapshots["integration showFileHeader with platform options set to false should show file header if file options set to true"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --size-padding-small: 0.5rem;
  --size-padding-medium: 1rem;
  --size-padding-large: 1rem;
  --size-padding-xl: 1rem;
}
`;
/* end snapshot integration showFileHeader with platform options set to false should show file header if file options set to true */

