/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["transform map correctly transforms tokenMap and defers tokens transforms as needed"] = 
`[
  [
    "{colors.red.500}",
    {
      "value": "#ff0000",
      "name": "500",
      "attributes": {}
    }
  ],
  [
    "{colors.foreground.primary}",
    {
      "value": "#ff0000",
      "name": "transform result",
      "attributes": {}
    }
  ],
  [
    "{spacing.0}",
    {
      "value": "0px",
      "name": "0",
      "attributes": {
        "foo": "bar"
      }
    }
  ],
  [
    "{spacing.1}",
    {
      "value": "4px",
      "name": "1",
      "attributes": {
        "bar": "foo"
      }
    }
  ],
  [
    "{spacing.2}",
    {
      "value": "8px",
      "name": "2",
      "attributes": {}
    }
  ],
  [
    "{spacing.0p5}",
    {
      "value": "2px",
      "name": "0p5",
      "attributes": {}
    }
  ],
  [
    "{spacing.0p5-ref}",
    {
      "value": 2,
      "name": "0p5-ref",
      "attributes": {}
    }
  ],
  [
    "{border}",
    {
      "value": {
        "width": 2,
        "color": "#ff0000",
        "width_plus_one": 3
      },
      "name": "border",
      "attributes": {}
    }
  ]
]`;
/* end snapshot transform map correctly transforms tokenMap and defers tokens transforms as needed */

snapshots["transform map handles and collects errors from transformations"] = 
`Transform Error: token "colors.red.500" (/foo.json) with value: 
  \`123\` (type: number)
could not be transformed by "test-attribute-transform" transform. Threw the following error: 

num.replace is not a function
TypeError: num.replace is not a function
    at 

Transform Error: token "colors.red.500" (/foo.json) with value: 
  \`123\` (type: number)
could not be transformed by "test-value-transform" transform. Threw the following error: 

num.replace is not a function
TypeError: num.replace is not a function
    at 

Transform Error: token "colors.red.500" (/foo.json) with value: 
  \`123\` (type: number)
could not be transformed by "test-name-transform" transform. Threw the following error: 

num.replace is not a function
TypeError: num.replace is not a function
    at `;
/* end snapshot transform map handles and collects errors from transformations */

