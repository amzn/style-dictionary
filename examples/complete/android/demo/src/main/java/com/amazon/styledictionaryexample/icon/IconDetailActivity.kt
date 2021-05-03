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
package com.amazon.styledictionaryexample.icon

import android.os.Bundle
import com.amazon.styledictionaryexample.BaseActivity
import com.amazon.styledictionaryexample.R

/**
 * An activity representing a single Icon detail screen. This
 * activity is only used narrow width devices. On tablet-size devices,
 * item details are presented side-by-side with a list of items
 * in a [IconListActivity].
 */
class IconDetailActivity : BaseActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_icon_detail)

    // Show the Up button in the action bar.
    val actionBar = actionBar
    actionBar?.setDisplayHomeAsUpEnabled(true)
    if (savedInstanceState == null) {
      // Create the detail fragment and add it to the activity
      // using a fragment transaction.
      val fragment = IconDetailFragment()
      supportFragmentManager
        .beginTransaction()
        .add(R.id.icon_detail_container, fragment)
        .commit()
    }
  }
}