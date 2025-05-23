/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["css/variables hsl syntax should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --color-red: #ff0000;
  --color-green: hsl(120, 50%, 50%);
}
`;
/* end snapshot css/variables hsl syntax should match snapshot */

snapshots["css/variables hsl syntax with references should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --color-red: #ff0000;
  --color-green: hsl(120, 50%, 50%);
}
`;
/* end snapshot css/variables hsl syntax with references should match snapshot */

snapshots["css/variables hex syntax should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --color-red: #ff0000;
  --color-green: #40bf40;
}
`;
/* end snapshot css/variables hex syntax should match snapshot */

snapshots["css/variables hex syntax with references should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --color-red: #ff0000;
  --color-green: #40bf40;
}
`;
/* end snapshot css/variables hex syntax with references should match snapshot */

snapshots["css/variables border should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --border-primary: 0.125rem solid #ff0000;
}
`;
/* end snapshot css/variables border should match snapshot */

snapshots["css/variables border with references should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --border-primary: var(--size-border) solid var(--color-red);
}
`;
/* end snapshot css/variables border with references should match snapshot */

snapshots["css/variables shadow should match snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --shadow-light: 0 0 0 #ff0000, 0 0 0 #40bf40;
  --shadow-dark: 0 0 0 #40bf40, 0 0 0 #ff0000;
}
`;
/* end snapshot css/variables shadow should match snapshot */

snapshots["css/variables shadow should match snapshot with references"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --shadow-light: 0 0 0 var(--color-red), 0 0 0 var(--color-green);
  --shadow-dark: 0 0 0 var(--color-green), 0 0 0 var(--color-red);
}
`;
/* end snapshot css/variables shadow should match snapshot with references */

snapshots["scss/variables should match snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

$border-primary: 0.125rem solid #ff0000;
`;
/* end snapshot scss/variables should match snapshot */

snapshots["scss/variables with references should match snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

$border-primary: $size-border solid $color-red;
`;
/* end snapshot scss/variables with references should match snapshot */

snapshots["integration object values css/variables shadow should match snapshot with references"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --shadow-light: 0 0 0 var(--color-red), 0 0 0 var(--color-green);
  --shadow-dark: 0 0 0 var(--color-green), 0 0 0 var(--color-red);
}
`;
/* end snapshot integration object values css/variables shadow should match snapshot with references */

snapshots["integration object values css/variables hsl syntax should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --color-red: #ff0000;
  --color-green: hsl(120, 50%, 50%);
}
`;
/* end snapshot integration object values css/variables hsl syntax should match snapshot */

snapshots["integration object values css/variables hsl syntax with references should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --color-red: #ff0000;
  --color-green: hsl(var(--hue), var(--saturation), var(--lightness));
}
`;
/* end snapshot integration object values css/variables hsl syntax with references should match snapshot */

snapshots["integration object values css/variables hex syntax should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --color-red: #ff0000;
  --color-green: #40bf40;
}
`;
/* end snapshot integration object values css/variables hex syntax should match snapshot */

snapshots["integration object values css/variables hex syntax with references should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --color-red: #ff0000;
  --color-green: #40bf40;
}
`;
/* end snapshot integration object values css/variables hex syntax with references should match snapshot */

snapshots["integration object values css/variables border should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --border-primary: 0.125rem solid #ff0000;
}
`;
/* end snapshot integration object values css/variables border should match snapshot */

snapshots["integration object values css/variables border with references should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --border-primary: var(--size-border) solid var(--color-red);
}
`;
/* end snapshot integration object values css/variables border with references should match snapshot */

snapshots["integration object values css/variables shadow should match snapshot"] = 
`/**
 * Do not edit directly, this file was auto-generated.
 */

:root {
  --shadow-light: 0 0 0 #ff0000, 0 0 0 #40bf40;
  --shadow-dark: 0 0 0 #40bf40, 0 0 0 #ff0000;
}
`;
/* end snapshot integration object values css/variables shadow should match snapshot */

snapshots["integration object values scss/variables should match snapshot"] = 
`
// Do not edit directly, this file was auto-generated.

$border-primary: 0.125rem solid #ff0000;
`;
/* end snapshot integration object values scss/variables should match snapshot */

snapshots["integration object values scss/variables with references should match snapshot"] = 
`
// Do not edit directly, this file was auto-generated.

$border-primary: $size-border solid $color-red;
`;
/* end snapshot integration object values scss/variables with references should match snapshot */

