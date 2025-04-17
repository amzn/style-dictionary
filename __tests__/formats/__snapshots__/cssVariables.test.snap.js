/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats css/variables should have a valid CSS syntax and match snapshot 1"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

.selector {
  --color-base-red-400: #EF5350;
}
`;
/* end snapshot formats css/variables should have a valid CSS syntax and match snapshot 1 */

snapshots["formats css/variables should have a valid CSS syntax and match snapshot when selector is an array 2"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

@media screen and (min-width: 768px) {
  .selector1 {
    .selector2 {
      --color-base-red-400: #EF5350;
    }
  }
}
`;
/* end snapshot formats css/variables should have a valid CSS syntax and match snapshot when selector is an array 2 */

