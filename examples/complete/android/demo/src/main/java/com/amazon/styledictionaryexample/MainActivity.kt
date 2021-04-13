/*
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with
 * the License. A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 * CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions
 * and limitations under the License.
 */
package com.amazon.styledictionaryexample

import android.content.Intent
import android.graphics.Typeface
import android.os.Bundle
import android.view.View
import android.widget.Button
import com.amazon.styledictionaryexample.color.ColorsActivity
import com.amazon.styledictionaryexample.icon.IconListActivity
import com.amazon.styledictionaryexample.property.PropertiesActivity
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper

@Suppress("UNUSED_PARAMETER")
class MainActivity : BaseActivity() {
  private var propertiesButton: Button? = null
  private var colorsButton: Button? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)
    StyleDictionaryHelper.loadJSON(this)
    propertiesButton = findViewById(R.id.activity_main_properties_button)
    colorsButton = findViewById(R.id.activity_main_colors_button)
  }

  fun colorsButton(view: View) {
    val colorsIntent = Intent(this, ColorsActivity::class.java)
    startActivity(colorsIntent)
  }

  fun propertiesButton(view: View) {
    val propertiesIntent = Intent(this, PropertiesActivity::class.java)
    startActivity(propertiesIntent)
  }

  fun iconsButton(view: View) {
    val iconsIntent = Intent(this, IconListActivity::class.java)
    startActivity(iconsIntent)
  }
}