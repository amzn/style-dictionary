/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["scss/map-flat snapshot"] = 
`
/**
 * Do not edit directly, this file was auto-generated.
 */

$tokens: (
  'size-font-small': 12rem,
  'size-font-large': 18rem,
  // comment
  'color-base-red': #ff0000,
  'color-white': #ffffff,
  'asset-icon-book': url("data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9vayI+PHBhdGggZD0iTTQgMTkuNUEyLjUgMi41IDAgMCAxIDYuNSAxN0gyMCI+PC9wYXRoPjxwYXRoIGQ9Ik02LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA0IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJ6Ij48L3BhdGg+PC9zdmc+")
);`;
/* end snapshot scss/map-flat snapshot */

snapshots["scss/map-deep snapshot"] = 
`
/**
 * Do not edit directly, this file was auto-generated.
 */

$size-font-small: 12rem !default;
$size-font-large: 18rem !default;
$color-base-red: #ff0000 !default; // comment
$color-white: #ffffff !default;
$asset-icon-book: url("data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9vayI+PHBhdGggZD0iTTQgMTkuNUEyLjUgMi41IDAgMCAxIDYuNSAxN0gyMCI+PC9wYXRoPjxwYXRoIGQ9Ik02LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA0IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJ6Ij48L3BhdGg+PC9zdmc+") !default;

$tokens: (
  'size': (
    'font': (
      'small': $size-font-small,
      'large': $size-font-large
    )
  ),
  'color': (
    'base': (
      'red': $color-base-red
    ),
    'white': $color-white
  ),
  'asset': (
    'icon': (
      'book': $asset-icon-book
    )
  )
);
`;
/* end snapshot scss/map-deep snapshot */

snapshots["should respect formatting options for scss/map-flat"] = 
`
/**
 * Do not edit directly, this file was auto-generated.

 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

$tokens:: (

    '$foo-size-font-small':: 12rem,

    '$foo-size-font-large':: 18rem,

    /* comment */
    '$foo-color-base-red':: #ff0000,

    '$foo-color-white':: #ffffff,

    '$foo-asset-icon-book':: url("data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9vayI+PHBhdGggZD0iTTQgMTkuNUEyLjUgMi41IDAgMCAxIDYuNSAxN0gyMCI+PC9wYXRoPjxwYXRoIGQ9Ik02LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA0IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJ6Ij48L3BhdGg+PC9zdmc+")

);;`;
/* end snapshot should respect formatting options for scss/map-flat */

snapshots["should respect formatting options for scss/map-deep"] = 
`
/**
 * Do not edit directly, this file was auto-generated.

 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

    $foo-size-font-small:: 12rem !default;;

    $foo-size-font-large:: 18rem !default;;

    /* comment */
    $foo-color-base-red:: #ff0000 !default;;

    $foo-color-white:: #ffffff !default;;

    $foo-asset-icon-book:: url("data:image/png;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItYm9vayI+PHBhdGggZD0iTTQgMTkuNUEyLjUgMi41IDAgMCAxIDYuNSAxN0gyMCI+PC9wYXRoPjxwYXRoIGQ9Ik02LjUgMkgyMHYyMEg2LjVBMi41IDIuNSAwIDAgMSA0IDE5LjV2LTE1QTIuNSAyLjUgMCAwIDEgNi41IDJ6Ij48L3BhdGg+PC9zdmc+") !default;;

$tokens:: (

    'size':: (

        'font':: (

            'small':: $foo-size-font-small,

            'large':: $foo-size-font-large

        )

    ),

    'color':: (

        'base':: (

            'red':: $foo-color-base-red

        ),

        'white':: $foo-color-white

    ),

    'asset':: (

        'icon':: (

            'book':: $foo-asset-icon-book

        )

    )

);;
`;
/* end snapshot should respect formatting options for scss/map-deep */
