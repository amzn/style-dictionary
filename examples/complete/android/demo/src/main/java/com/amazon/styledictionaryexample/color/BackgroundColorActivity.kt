package com.amazon.styledictionaryexample.color

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.amazon.styledictionaryexample.BaseActivity
import com.amazon.styledictionaryexample.R
import com.amazon.styledictionaryexample.models.Property
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper
import java.util.*

class BackgroundColorActivity : BaseActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_background_color)
    val recyclerView = findViewById<View>(R.id.background_color_list)!!
    (recyclerView as RecyclerView).adapter =
      SimpleItemRecyclerViewAdapter(
        backgroundColors)
  }

  protected val backgroundColors: ArrayList<Property>
    protected get() {
      val path = ArrayList<String>()
      path.add("color")
      path.add("background")
      return StyleDictionaryHelper.getArrayOfProps(path)
    }

  inner class SimpleItemRecyclerViewAdapter(private val mValues: List<Property>) :
    RecyclerView.Adapter<SimpleItemRecyclerViewAdapter.ViewHolder>() {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
      val view = LayoutInflater.from(parent.context)
        .inflate(R.layout.background_color_list_item, parent, false)
      return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
      holder.mItem = mValues[position]
      val id = resources.getIdentifier(holder.mItem!!.name, "color", packageName)
      holder.mSwatchView.setBackgroundColor(resources.getColor(id, null))
      holder.mTitleView.text = holder.mItem!!.attributes["item"]
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
      var mSwatchView: View
      var mTitleView: TextView
      var mItem: Property? = null
      override fun toString(): String {
        return super.toString() + " '" + mTitleView.text + "'"
      }

      init {
        mSwatchView = mView.findViewById(R.id.swatch)
        mTitleView = mView.findViewById(R.id.title)
      }
    }
  }
}