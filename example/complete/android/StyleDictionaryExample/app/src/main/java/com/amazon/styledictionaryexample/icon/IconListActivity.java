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

package com.amazon.styledictionaryexample.icon;

import android.app.ActionBar;
import android.content.Context;
import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.util.StringHelper;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * An activity representing a list of Icons.
 */
public class IconListActivity extends BaseActivity {
    private static final String TAG = IconListActivity.class.getSimpleName();
    private Typeface iconFont;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_icon_list);
        // Show the Up button in the action bar.
        ActionBar actionBar = getActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }

        iconFont = Typeface.createFromAsset(getAssets(), "fonts/MaterialIcons-Regular.ttf");

        View recyclerView = findViewById(R.id.icon_list);
        assert recyclerView != null;

        ((RecyclerView) recyclerView).setAdapter(
                new SimpleItemRecyclerViewAdapter( getIconList() )
        );
    }

    protected ArrayList<Property> getIconList() {
        ArrayList<String> path = new ArrayList<>();
        path.add("content");
        path.add("icon");
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
                    .inflate(R.layout.icon_list_content, parent, false);
            return new ViewHolder(view);
        }

        @Override
        public void onBindViewHolder(final ViewHolder holder, int position) {
            holder.mItem = mValues.get(position);
            holder.mIconView.setText(holder.mItem.value);
            holder.mTitleView.setText( StringHelper.nameToDisplay(holder.mItem.attributes.get("item")) );

            holder.mView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Context context = v.getContext();
                    Intent intent = new Intent(context, IconDetailActivity.class);
                    intent.putStringArrayListExtra(IconDetailFragment.ARG_ITEM_PATH, holder.mItem.path);
                    context.startActivity(intent);
                }
            });
        }

        @Override
        public int getItemCount() {
            return mValues.size();
        }

        public class ViewHolder extends RecyclerView.ViewHolder {
            public final View mView;
            @BindView(R.id.icon) TextView mIconView;
            @BindView(R.id.title) TextView mTitleView;
            public Property mItem;

            public ViewHolder(View view) {
                super(view);
                mView = view;
                ButterKnife.bind(this, view);
                mIconView.setTypeface(iconFont);
            }

            @Override
            public String toString() {
                return super.toString() + " '" + mTitleView.getText() + "'";
            }
        }
    }
}
