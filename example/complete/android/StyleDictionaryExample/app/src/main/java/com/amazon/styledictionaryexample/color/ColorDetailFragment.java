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

import android.app.Fragment;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.property.PropertyDetailActivity;
import com.amazon.styledictionaryexample.util.StringHelper;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;

import butterknife.BindView;
import butterknife.ButterKnife;


public class ColorDetailFragment extends Fragment {

    private Property property;
    @BindView(R.id.color_swatch) View swatch;
    @BindView(R.id.color_title) TextView title;
    @BindView(R.id.color_detail_body) TextView body;

    public ColorDetailFragment() {
        // Required empty public constructor
    }

    public static ColorDetailFragment newInstance(ArrayList<String> path) {
        ColorDetailFragment fragment = new ColorDetailFragment();
        Bundle args = new Bundle();
        args.putStringArrayList(PropertyDetailActivity.ARG_PATH, path);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_color_detail, container, false);
        ButterKnife.bind(this, view);
        ArrayList<String> path = getActivity().getIntent().getStringArrayListExtra(PropertyDetailActivity.ARG_PATH);

        if (path != null) {
            property = StyleDictionaryHelper.getProperty( path );
            int id = getResources().getIdentifier(property.name, "color", getActivity().getPackageName());
            swatch.setBackgroundColor(getResources().getColor(id, null));
            title.setText( getTitle() );
            body.setText( "@color/".concat(property.name) );
        }
        return view;
    }


    private String getTitle() {
        switch(property.attributes.get("type")) {
            case "base":
                return StringHelper.nameToDisplay(property.attributes.get("item")) + " " + property.attributes.get("subitem");
            default:
                return StringHelper.nameToDisplay(property.attributes.get("item")) + " " + property.attributes.get("subitem");
        }
    }
}
