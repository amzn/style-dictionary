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

import android.content.Intent
import android.graphics.Typeface
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.amazon.styledictionaryexample.BaseActivity
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.models.Property
import com.amazon.styledictionaryexample.util.StringHelper
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper
import java.util.*

/**
 * An activity representing a list of Icons.
 */
class IconListActivity : BaseActivity() {
  private var iconFont: Typeface? = null
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_icon_list)
    // Show the Up button in the action bar.
    val actionBar = actionBar
    actionBar?.setDisplayHomeAsUpEnabled(true)
    iconFont = Typeface.createFromAsset(assets, "fonts/MaterialIcons-Regular.ttf")
    val recyclerView = findViewById<View>(R.id.icon_list)!!
    (recyclerView as RecyclerView).adapter =
      SimpleItemRecyclerViewAdapter(
        iconList)
  }

  protected val iconList: ArrayList<Property>
    protected get() {
      val path = ArrayList<String>()
      path.add("content")
      path.add("icon")
      return StyleDictionaryHelper.getArrayOfProps(path)
    }

  inner class SimpleItemRecyclerViewAdapter(private val mValues: List<Property>) :
    RecyclerView.Adapter<SimpleItemRecyclerViewAdapter.ViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
      val view = LayoutInflater.from(parent.context)
        .inflate(R.layout.icon_list_content, parent, false)
      return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
      holder.mItem = mValues[position]
      holder.mIconView.text = holder.mItem!!.value
      holder.mTitleView.text = StringHelper.nameToDisplay(holder.mItem!!.attributes["item"])
      holder.mView.setOnClickListener { v ->
        val context = v.context
        val intent = Intent(context, IconDetailActivity::class.java)
        intent.putStringArrayListExtra(
          IconDetailFragment.Companion.ARG_ITEM_PATH,
          holder.mItem!!.path)
        context.startActivity(intent)
      }
    }

    override fun getItemCount(): Int {
      return mValues.size
    }

    inner class ViewHolder(val mView: View) : RecyclerView.ViewHolder(
      mView) {
      var mIconView: TextView
      var mTitleView: TextView
      var mItem: Property? = null
      override fun toString(): String {
        return super.toString() + " '" + mTitleView.text + "'"
      }

      init {
        mIconView = mView.findViewById(R.id.icon)
        mTitleView = mView.findViewById(R.id.title)
        mIconView.typeface = iconFont
      }
    }
  }

  companion object {
    private val TAG = IconListActivity::class.java.simpleName
  }
}