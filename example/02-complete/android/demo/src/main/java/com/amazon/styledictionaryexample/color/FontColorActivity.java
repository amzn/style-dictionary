package com.amazon.styledictionaryexample.color;

import android.os.Bundle;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class FontColorActivity extends BaseActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_font_color);

        View recyclerView = findViewById(R.id.font_color_list);
        assert recyclerView != null;

        ((RecyclerView) recyclerView).setAdapter(
                new SimpleItemRecyclerViewAdapter( getFontColors() )
        );
    }

    protected ArrayList<Property> getFontColors() {
        ArrayList<String> path = new ArrayList<>();
        path.add("color");
        path.add("font");
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
            @BindView(R.id.swatch)
            View mSwatchView;
            @BindView(R.id.title)
            TextView mTitleView;
            public Property mItem;

            public ViewHolder(View view) {
                super(view);
                mView = view;
                ButterKnife.bind(this, view);
            }

            @Override
            public String toString() {
                return super.toString() + " '" + mTitleView.getText() + "'";
            }
        }
    }
}
