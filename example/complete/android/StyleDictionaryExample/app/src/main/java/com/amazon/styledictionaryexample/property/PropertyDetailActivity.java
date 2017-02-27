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

package com.amazon.styledictionaryexample.property;

import android.app.ActionBar;
import android.app.Fragment;
import android.os.Bundle;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.icon.IconDetailFragment;
import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.color.ColorDetailFragment;

import java.util.ArrayList;

public class PropertyDetailActivity extends BaseActivity {
    public static final String ARG_PATH = "path";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_property_detail);

        // Show the Up button in the action bar.
        ActionBar actionBar = getActionBar();
        if (actionBar != null) {
            actionBar.setDisplayHomeAsUpEnabled(true);
        }

        if (savedInstanceState == null) {
            // Create the detail fragment and add it to the activity
            // using a fragment transaction.
            ArrayList<String> path = getIntent().getStringArrayListExtra(ARG_PATH);
            String category = path.get(0);
            Fragment fragment;

            switch (category) {
                case "color":
                    fragment = new ColorDetailFragment();
                    break;
                case "content":
                    fragment = new IconDetailFragment();
                    break;
                default:
                    fragment = new ColorDetailFragment();
                    break;
            }

            getFragmentManager()
                    .beginTransaction()
                    .add(R.id.property_detail_container, fragment)
                    .commit();
        }
    }
}
