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

import android.content.Intent
import android.os.Bundle
import android.transition.Slide
import android.view.Gravity
import androidx.fragment.app.Fragment
import com.amazon.styledictionaryexample.BaseActivity
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.models.StyleDictionaryNode
import com.amazon.styledictionaryexample.property.PropertyFragment.OnListFragmentInteractionListener
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper
import java.util.*

class PropertiesActivity : BaseActivity(), OnListFragmentInteractionListener {
  val path: MutableList<String> = mutableListOf()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_properties)
    val ab = actionBar
    ab?.setDisplayHomeAsUpEnabled(true)
  }

  override fun onListFragmentInteraction(item: StyleDictionaryNode?) {
    if (item!!.isLeaf) {
      // Clone the path list because we don't want to
      // add the properties key to the path - when the user goes back
      // we don't need to try to pop off the last item
      val _path = ArrayList(path)
      _path.add(item.name)
      val intent = Intent(this, PropertyDetailActivity::class.java)
      intent.putStringArrayListExtra(PropertyDetailActivity.ARG_PATH, _path)
      startActivity(intent)
    } else {
      path.add(item.name)
      val nodeList = StyleDictionaryHelper.getArrayAtPath(path)

      // Create new fragment and transaction
      val newFragment: Fragment = PropertyFragment.newInstance(nodeList)
      newFragment.exitTransition = Slide(Gravity.START)
      newFragment.enterTransition = Slide(Gravity.END)
      val transaction = supportFragmentManager.beginTransaction()
      transaction.add(R.id.activity_properties, newFragment, item.name)
      transaction.addToBackStack(item.name)

      // Commit the transaction
      transaction.commit()
    }
  }

  override fun onBackPressed() {
    if (supportFragmentManager.backStackEntryCount > 0) {
      supportFragmentManager.popBackStack()
      if (path.size >= 1) {
        path.removeAt(path.size - 1)
      }
    } else {
      super.onBackPressed()
    }
  }
}