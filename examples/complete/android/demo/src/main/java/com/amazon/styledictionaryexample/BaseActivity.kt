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
import android.view.MenuItem
import androidx.fragment.app.FragmentActivity

open class BaseActivity : FragmentActivity() {
  override fun finish() {
    super.finish()
    overridePendingTransitionExit()
  }

  override fun startActivity(intent: Intent) {
    super.startActivity(intent)
    overridePendingTransitionEnter()
  }

  override fun onOptionsItemSelected(item: MenuItem): Boolean {
    // Handle action bar item clicks here. The action bar will
    // automatically handle clicks on the Home/Up button, as long
    // as you specify a parent activity in AndroidManifest.xml.
    val id = item.itemId
    if (id == android.R.id.home) {
      finish()
      overridePendingTransition(R.anim.slide_from_left, R.anim.slide_to_right)
      return true
    }
    return super.onOptionsItemSelected(item)
  }

  /**
   * Overrides the pending Activity transition by performing the "Enter" animation.
   */
  private fun overridePendingTransitionEnter() {
    overridePendingTransition(R.anim.slide_from_right, R.anim.slide_to_left)
  }

  /**
   * Overrides the pending Activity transition by performing the "Exit" animation.
   */
  private fun overridePendingTransitionExit() {
    overridePendingTransition(R.anim.slide_from_left, R.anim.slide_to_right)
  }
}