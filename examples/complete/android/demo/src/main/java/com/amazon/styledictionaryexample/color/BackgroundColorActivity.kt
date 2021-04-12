package com.amazon.styledictionaryexample.color;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;
import java.util.List;

public class BackgroundColorActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_background_color);

        View recyclerView = findViewById(R.id.background_color_list);
        assert recyclerView != null;

        ((RecyclerView) recyclerView).setAdapter(
                new SimpleItemRecyclerViewAdapter( getBackgroundColors() )
        );
    }

    protected ArrayList<Property> getBackgroundColors() {
        ArrayList<String> path = new ArrayList<>();
        path.add("color");
        path.add("background");
        return StyleDictionaryHelper.getArrayOfProps(path);
    }

    public class SimpleItemRecyclerViewAdapter
            extends RecyclerView.Adapter<SimpleItemRecyclerViewAdapter.ViewHolder> {

        private final List<Property> mValues;

        public SimpleItemRecyclerViewAdapter(List<Property> items) {
            mValues = items;
        }

        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.background_color_list_item, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(final ViewHolder holder, int position) {
            holder.mItem = mValues.get(position);
            int id = getResources().getIdentifier(holder.mItem.name, "color", getPackageName());
            holder.mSwatchView.setBackgroundColor(getResources().getColor(id, null));
            holder.mTitleView.setText(holder.mItem.attributes.get("item"));

            holder.mView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
//                    Context context = v.getContext();
//                    Intent intent = new Intent(context, IconDetailActivity.class);
//                    intent.putStringArrayListExtra(IconDetailFragment.ARG_ITEM_PATH, holder.mItem.path);
//                    context.startActivity(intent);
                }
            });
        }

        @Override
        public int getItemCount() {
            return mValues.size();
        }

        public class ViewHolder extends RecyclerView.ViewHolder {
            public final View mView;
            View mSwatchView;
            TextView mTitleView;
            public Property mItem;

            public ViewHolder(View view) {
                super(view);
                mView = view;
                mSwatchView = view.findViewById(R.id.swatch);
                mTitleView = view.findViewById(R.id.title);
            }

            @Override
            public String toString() {
                return super.toString() + " '" + mTitleView.getText() + "'";
            }
        }
    }
}
