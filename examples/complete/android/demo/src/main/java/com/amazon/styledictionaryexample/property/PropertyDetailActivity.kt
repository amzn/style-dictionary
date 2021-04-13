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
package com.amazon.styledictionaryexample.property

import android.os.Bundle
import androidx.fragment.app.Fragment
import com.amazon.styledictionaryexample.BaseActivity
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.color.ColorDetailFragment
import com.amazon.styledictionaryexample.icon.IconDetailFragment

class PropertyDetailActivity : BaseActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_property_detail)

    // Show the Up button in the action bar.
    val actionBar = actionBar
    actionBar?.setDisplayHomeAsUpEnabled(true)
    if (savedInstanceState == null) {
      // Create the detail fragment and add it to the activity
      // using a fragment transaction.
      val path = intent.getStringArrayListExtra(ARG_PATH)
      val fragment: Fragment = when (path!![0]) {
        "color" -> ColorDetailFragment()
        "content" -> IconDetailFragment()
        else -> ColorDetailFragment()
      }
      supportFragmentManager
        .beginTransaction()
        .add(R.id.property_detail_container, fragment)
        .commit()
    }
  }

  companion object {
    const val ARG_PATH = "path"
  }
}