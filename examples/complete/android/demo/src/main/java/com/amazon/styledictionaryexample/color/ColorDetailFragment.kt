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
package com.amazon.styledictionaryexample.color

import android.app.Fragment
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.models.Property
import com.amazon.styledictionaryexample.property.PropertyDetailActivity
import com.amazon.styledictionaryexample.util.StringHelper
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper
import java.util.*

class ColorDetailFragment : Fragment() {
  private var property: Property? = null
  var swatch: View? = null
  var title: TextView? = null
  var body: TextView? = null
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
  }

  override fun onCreateView(
    inflater: LayoutInflater, container: ViewGroup?,
    savedInstanceState: Bundle
  ): View? {
    // Inflate the layout for this fragment
    val view = inflater.inflate(R.layout.fragment_color_detail, container, false)
    swatch = view.findViewById(R.id.color_swatch)
    title = view.findViewById(R.id.color_title)
    body = view.findViewById(R.id.color_detail_body)
    val path = activity.intent.getStringArrayListExtra(PropertyDetailActivity.ARG_PATH)
    if (path != null) {
      property = StyleDictionaryHelper.getProperty(path)
      val id = resources.getIdentifier(property.name, "color", activity.packageName)
      swatch.setBackgroundColor(resources.getColor(id, null))
      title.setText(getTitle())
      body.setText("@color/" + property.name)
    }
    return view
  }

  private fun getTitle(): String {
    return when (property!!.attributes["type"]) {
      "base" -> StringHelper.nameToDisplay(property!!.attributes["item"]) + " " + property!!.attributes["subitem"]
      else -> StringHelper.nameToDisplay(property!!.attributes["item"]) + " " + property!!.attributes["subitem"]
    }
  }

  companion object {
    fun newInstance(path: ArrayList<String?>?): ColorDetailFragment {
      val fragment = ColorDetailFragment()
      val args = Bundle()
      args.putStringArrayList(PropertyDetailActivity.ARG_PATH, path)
      fragment.arguments = args
      return fragment
    }
  }
}