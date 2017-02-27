/**
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

import android.app.Fragment;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.util.StringHelper;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;

/**
 * A fragment representing a single Icon detail screen.
 * This fragment is either contained in a {@link IconListActivity}
 * in two-pane mode (on tablets) or a {@link IconDetailActivity}
 * on handsets.
 */
public class IconDetailFragment extends Fragment {
    private static final String TAG = IconDetailFragment.class.getSimpleName();
    private Typeface iconFont;
    public static final String ARG_ITEM_PATH = "path";
    private Property mItem;
    @BindView(R.id.icon_detail_title) TextView title;
    @BindView(R.id.icon_display) TextView icon;
    @BindView(R.id.icon_detail_body) TextView body;

    /**
     * Mandatory empty constructor for the fragment manager to instantiate the
     * fragment (e.g. upon screen orientation changes).
     */
    public IconDetailFragment() {
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.icon_detail, container, false);
        ButterKnife.bind(this, view);

        ArrayList<String> path = getActivity().getIntent().getStringArrayListExtra(ARG_ITEM_PATH);
        iconFont = Typeface.createFromAsset(getActivity().getAssets(), "fonts/MaterialIcons-Regular.ttf");

        if (path != null) {
            mItem = StyleDictionaryHelper.getProperty( path );
            title.setText( StringHelper.nameToDisplay(mItem.attributes.get("item")) );
            icon.setTypeface(iconFont);
            icon.setText(mItem.value);
            body.setText("@string/".concat(mItem.name));
        }

        return view;
    }
}
