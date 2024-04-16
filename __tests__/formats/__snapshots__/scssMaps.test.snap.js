/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["scss/map-flat snapshot"] = 
`
/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
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
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
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

