/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats compose/object should match default snapshot"] = 
`

// Do not edit directly, this file was auto-generated.



package 

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.*

object {
  /** comment */
  val color-base-red = #ff0000
  val color-white = #ffffff
  val size-font-large = 18rem
  val size-font-small = 12rem
}
`;
/* end snapshot formats compose/object should match default snapshot */

snapshots["formats compose/object with options overrides should match snapshot"] = 
`

// Do not edit directly, this file was auto-generated.



package com.example.tokens

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.*

public data object MyObject {
  /** comment */
  public val color-base-red = #ff0000
  public val color-white = #ffffff
  public val size-font-large = 18rem
  public val size-font-small = 12rem
}
`;
/* end snapshot formats compose/object with options overrides should match snapshot */

