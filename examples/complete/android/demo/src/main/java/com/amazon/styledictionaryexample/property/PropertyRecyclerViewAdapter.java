package com.amazon.styledictionaryexample.property;

import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.StyleDictionaryNode;
import com.amazon.styledictionaryexample.property.PropertyFragment.OnListFragmentInteractionListener;

import java.util.List;

/**
 * {@link RecyclerView.Adapter} that can display a {@link StyleDictionaryNode} and makes a call to the
 * specified {@link OnListFragmentInteractionListener}.
 */
public class PropertyRecyclerViewAdapter extends RecyclerView.Adapter<PropertyRecyclerViewAdapter.ViewHolder> {

    private static final String TAG = PropertyRecyclerViewAdapter.class.getSimpleName();
    private final List<StyleDictionaryNode> mValues;
    private final OnListFragmentInteractionListener mListener;

    public PropertyRecyclerViewAdapter(List<StyleDictionaryNode> items, OnListFragmentInteractionListener listener) {
        mValues = items;
        mListener = listener;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.fragment_property_list_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(final ViewHolder holder, int position) {
        holder.mItem = mValues.get(position);
        holder.mIdView.setText(mValues.get(position).name);

        if (mValues.get(position).isLeaf) {

        } else {
            holder.mContentView.setText(String.valueOf(mValues.get(position).count));
        }

        holder.mView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (null != mListener) {
                    // Notify the active callbacks interface (the activity, if the
                    // fragment is attached to one) that an item has been selected.
                    mListener.onListFragmentInteraction(holder.mItem);
                }
            }
        });
    }

    @Override
    public int getItemCount() {
        return mValues.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        public final View mView;
        public final TextView mIdView;
        public final TextView mContentView;
        public StyleDictionaryNode mItem;

        public ViewHolder(View view) {
            super(view);
            mView = view;
            mIdView = (TextView) view.findViewById(R.id.id);
            mContentView = (TextView) view.findViewById(R.id.content);
        }

        @Override
        public String toString() {
            return super.toString() + " '" + mContentView.getText() + "'";
        }
    }
}
