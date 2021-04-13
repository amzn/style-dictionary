/**
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

import android.annotation.SuppressLint
import android.graphics.Typeface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.models.Property
import com.amazon.styledictionaryexample.util.StringHelper
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper

/**
 * A fragment representing a single Icon detail screen.
 * This fragment is either contained in a [IconListActivity]
 * in two-pane mode (on tablets) or a [IconDetailActivity]
 * on handsets.
 */
class IconDetailFragment
/**
 * Mandatory empty constructor for the fragment manager to instantiate the
 * fragment (e.g. upon screen orientation changes).
 */
  : Fragment() {
  private var iconFont: Typeface? = null
  private var item: Property? = null
  private var title: TextView? = null
  private var icon: TextView? = null
  private var body: TextView? = null

  @SuppressLint("SetTextI18n")
  override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View? {
    val view = inflater.inflate(R.layout.icon_detail, container, false)
    icon = view.findViewById(R.id.icon_display)
    title = view.findViewById(R.id.icon_detail_title)
    body = view.findViewById(R.id.icon_detail_body)
    val path = activity!!.intent.getStringArrayListExtra(ARG_ITEM_PATH)
    iconFont = Typeface.createFromAsset(activity!!.assets, "fonts/MaterialIcons-Regular.ttf")
    if (path != null) {
      item = StyleDictionaryHelper.getProperty(path).apply {
        title?.text = StringHelper.nameToDisplay(attributes["item"]!!)
        icon?.typeface = iconFont
        icon?.text = value
        body?.text = "@string/$name"
      }
    }
    return view
  }

  companion object {
    const val ARG_ITEM_PATH = "path"
  }
}