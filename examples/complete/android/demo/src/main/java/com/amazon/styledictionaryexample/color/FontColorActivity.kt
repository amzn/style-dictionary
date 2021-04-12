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

class FontColorActivity : BaseActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_font_color)
    val recyclerView = findViewById<View>(R.id.font_color_list)!!
    (recyclerView as RecyclerView).adapter =
      SimpleItemRecyclerViewAdapter(
        fontColors)
  }

  protected val fontColors: ArrayList<Property>
    protected get() {
      val path = ArrayList<String>()
      path.add("color")
      path.add("font")
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

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
      val mView: View
      var mSwatchView: View
      var mTitleView: TextView
      var mItem: Property? = null
      override fun toString(): String {
        return super.toString() + " '" + mTitleView.text + "'"
      }

      init {
        mSwatchView = view.findViewById(R.id.swatch)
        mTitleView = view.findViewById(R.id.title)
        mView = view
      }
    }
  }
}