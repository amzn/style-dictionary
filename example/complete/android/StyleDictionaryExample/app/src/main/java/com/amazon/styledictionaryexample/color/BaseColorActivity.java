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

package com.amazon.styledictionaryexample.color;

import android.app.ActionBar;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.models.StyleDictionaryNode;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class BaseColorActivity extends BaseActivity {

    private static final String TAG = BaseColorActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_base_color);
        ActionBar ab = getActionBar();
        if (ab != null) {
            ab.setDisplayHomeAsUpEnabled(true);
        }

        View recyclerView = findViewById(R.id.base_color_list);
        assert recyclerView != null;

        ((RecyclerView) recyclerView).setAdapter(
                new SimpleItemRecyclerViewAdapter( getAllBaseColors() )
        );
    }


    protected ArrayList<StyleDictionaryNode> getBaseColorList() {
        ArrayList<String> path = new ArrayList<>();
        path.add("color");
        path.add("base");
        return StyleDictionaryHelper.getArrayAtPath(path);
    }

    protected ArrayList<BaseColorListItem> getAllBaseColors() {
        ArrayList<StyleDictionaryNode> baseColors = getBaseColorList();
        ArrayList<BaseColorListItem> allColors = new ArrayList<>();
        ArrayList<String> path = new ArrayList<>();
        path.add("color");
        path.add("base");
        for (StyleDictionaryNode node : baseColors) {
            if (!node.name.equals("white") && !node.name.equals("black")) {
                path.add(node.name);
                path.add("500");
                Property header = StyleDictionaryHelper.getProperty(path);
                allColors.add( new BaseColorListItem.BaseColorHeaderItem(header));
                path.remove( path.size() -1 );
                ArrayList<Property> props = StyleDictionaryHelper.getArrayOfProps(path);
                for (Property prop : props) {
                    allColors.add( new BaseColorListItem.BaseColorItem(prop) );
                }
                path.remove( path.size() -1 );
            }
        }
        return allColors;
    }


    public class SimpleItemRecyclerViewAdapter
            extends RecyclerView.Adapter<SimpleItemRecyclerViewAdapter.ViewHolder> {

        private final List<BaseColorListItem> mValues;

        public SimpleItemRecyclerViewAdapter(List<BaseColorListItem> items) {
            mValues = items;
        }

        @Override
        public int getItemViewType(int position) {
            if (mValues.get(position).isHeader()) {
                return 1;
            } else {
                return 0;
            }
        }

        @Override
        public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            View view;
            switch (viewType) {
                case 0:
                    view = LayoutInflater.from(parent.getContext())
                        .inflate(R.layout.base_color_list_content, parent, false);
                    break;
                case 1:
                    view = LayoutInflater.from(parent.getContext())
                            .inflate(R.layout.base_color_list_header, parent, false);
                    break;
                default:
                    view = LayoutInflater.from(parent.getContext())
                            .inflate(R.layout.base_color_list_content, parent, false);
                    break;
            }
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(ViewHolder holder, int position) {
            holder.mItem = mValues.get(position);

            int id = getResources().getIdentifier(holder.mItem.getProperty().name, "color", getPackageName());
            int fontColor;

            if (holder.mItem.getProperty().attributes.get("font").equals("inverse")) {
                fontColor = getResources().getColor(R.color.color_font_inverse_base, null);
            } else {
                fontColor = getResources().getColor(R.color.color_font_base, null);
            }

            holder.mTitleView.setText(holder.mItem.getTitle());
            holder.mTitleView.setTextColor(fontColor);

            if (holder.mValueView != null) {
                holder.mValueView.setText(holder.mItem.getSubtitle());
                holder.mValueView.setTextColor(fontColor);
            }

            holder.mView.setBackgroundColor(getResources().getColor(id, null));
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
            @BindView(R.id.title) TextView mTitleView;
            @Nullable
            @BindView(R.id.value) TextView mValueView;
            public BaseColorListItem mItem;

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
