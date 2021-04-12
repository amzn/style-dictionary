package com.amazon.styledictionaryexample.property

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.models.StyleDictionaryNode
import com.amazon.styledictionaryexample.property.PropertyFragment.OnListFragmentInteractionListener

/**
 * [RecyclerView.Adapter] that can display a [StyleDictionaryNode] and makes a call to the
 * specified [OnListFragmentInteractionListener].
 */
class PropertyRecyclerViewAdapter(
  private val mValues: List<StyleDictionaryNode>,
  private val mListener: OnListFragmentInteractionListener?
) : RecyclerView.Adapter<PropertyRecyclerViewAdapter.ViewHolder>() {
  override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
    val view = LayoutInflater.from(parent.context)
      .inflate(R.layout.fragment_property_list_item, parent, false)
    return ViewHolder(view)
  }

  override fun onBindViewHolder(holder: ViewHolder, position: Int) {
    holder.mItem = mValues[position]
    holder.mIdView.text = mValues[position].name
    if (mValues[position].isLeaf) {
    } else {
      holder.mContentView.text = java.lang.String.valueOf(mValues[position].count)
    }
    holder.mView.setOnClickListener { mListener?.onListFragmentInteraction(holder.mItem) }
  }

  override fun getItemCount(): Int {
    return mValues.size
  }

  inner class ViewHolder(val mView: View) : RecyclerView.ViewHolder(
    mView) {
    val mIdView: TextView
    val mContentView: TextView
    var mItem: StyleDictionaryNode? = null
    override fun toString(): String {
      return super.toString() + " '" + mContentView.text + "'"
    }

    init {
      mIdView = mView.findViewById<View>(R.id.id) as TextView
      mContentView = mView.findViewById<View>(R.id.content) as TextView
    }
  }

  companion object {
    private val TAG = PropertyRecyclerViewAdapter::class.java.simpleName
  }
}