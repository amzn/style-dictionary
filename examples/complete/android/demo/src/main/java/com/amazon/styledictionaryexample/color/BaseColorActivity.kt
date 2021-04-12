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

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.amazon.styledictionaryexample.BaseActivity
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.color.BaseColorListItem.BaseColorHeaderItem
import com.amazon.styledictionaryexample.color.BaseColorListItem.BaseColorItem
import com.amazon.styledictionaryexample.models.StyleDictionaryNode
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper
import java.util.*

class BaseColorActivity : BaseActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_base_color)
    val ab = actionBar
    ab?.setDisplayHomeAsUpEnabled(true)
    val recyclerView = findViewById<View>(R.id.base_color_list)!!
    (recyclerView as RecyclerView).adapter =
      SimpleItemRecyclerViewAdapter(
        allBaseColors)
  }

  protected val baseColorList: ArrayList<StyleDictionaryNode>
    protected get() {
      val path = ArrayList<String>()
      path.add("color")
      path.add("base")
      return StyleDictionaryHelper.getArrayAtPath(path)
    }
  protected val allBaseColors: ArrayList<BaseColorListItem>
    protected get() {
      val baseColors = baseColorList
      val allColors = ArrayList<BaseColorListItem>()
      val path = ArrayList<String>()
      path.add("color")
      path.add("base")
      for (node in baseColors) {
        if (node.name != "white" && node.name != "black") {
          path.add(node.name)
          path.add("500")
          val header = StyleDictionaryHelper.getProperty(path)
          allColors.add(BaseColorHeaderItem(header))
          path.removeAt(path.size - 1)
          val props = StyleDictionaryHelper.getArrayOfProps(path)
          for (prop in props) {
            allColors.add(BaseColorItem(prop))
          }
          path.removeAt(path.size - 1)
        }
      }
      return allColors
    }

  inner class SimpleItemRecyclerViewAdapter(private val mValues: List<BaseColorListItem>) :
    RecyclerView.Adapter<SimpleItemRecyclerViewAdapter.ViewHolder>() {
    override fun getItemViewType(position: Int): Int {
      return if (mValues[position].isHeader) {
        1
      } else {
        0
      }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
      val view: View
      view = when (viewType) {
        0 -> LayoutInflater.from(parent.context)
          .inflate(R.layout.base_color_list_content, parent, false)
        1 -> LayoutInflater.from(parent.context)
          .inflate(R.layout.base_color_list_header, parent, false)
        else -> LayoutInflater.from(parent.context)
          .inflate(R.layout.base_color_list_content, parent, false)
      }
      return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
      holder.mItem = mValues[position]
      val id = resources.getIdentifier(holder.mItem.getProperty().name, "color", packageName)
      val fontColor: Int
      fontColor = if (holder.mItem.getProperty().attributes["font"] == "inverse") {
        resources.getColor(R.color.color_font_inverse_base, null)
      } else {
        resources.getColor(R.color.color_font_base, null)
      }
      holder.mTitleView.text = holder.mItem.getTitle()
      holder.mTitleView.setTextColor(fontColor)
      if (holder.mValueView != null) {
        holder.mValueView.setText(holder.mItem.getSubtitle())
        holder.mValueView!!.setTextColor(fontColor)
      }
      holder.mView.setBackgroundColor(resources.getColor(id, null))
      holder.mView.setOnClickListener {
        //                    Context context = v.getContext();
//                    Intent intent = new Intent(context, IconDetailActivity.class);
//                    intent.putStringArrayListExtra(IconDetailFragment.ARG_ITEM_PATH, holder.mItem.path);
//                    context.startActivity(intent);
      }
    }

    override fun getItemCount(): Int {
      return mValues.size
    }

    inner class ViewHolder(val mView: View) : RecyclerView.ViewHolder(
      mView) {
      var mTitleView: TextView
      var mValueView: TextView?
      var mItem: BaseColorListItem? = null
      override fun toString(): String {
        return super.toString() + " '" + mTitleView.text + "'"
      }

      init {
        mTitleView = mView.findViewById(R.id.title)
        mValueView = mView.findViewById(R.id.value)
      }
    }
  }

  companion object {
    private val TAG = BaseColorActivity::class.java.simpleName
  }
}