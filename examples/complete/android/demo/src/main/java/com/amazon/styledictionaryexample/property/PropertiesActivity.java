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
import android.app.FragmentTransaction;
import android.content.Intent;
import android.os.Bundle;
import android.transition.Slide;
import android.view.Gravity;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;
import com.amazon.styledictionaryexample.models.StyleDictionaryNode;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

import java.util.ArrayList;


public class PropertiesActivity extends BaseActivity implements PropertyFragment.OnListFragmentInteractionListener {

    public ArrayList<String> path;
    private static final String TAG = PropertiesActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        path = new ArrayList<>();
        setContentView(R.layout.activity_properties);
        ActionBar ab = getActionBar();
        if (ab != null) {
            ab.setDisplayHomeAsUpEnabled(true);

        }
    }


    public void onListFragmentInteraction(StyleDictionaryNode item) {
        if (item.isLeaf) {
            // Clone the path list because we don't want to
            // add the properties key to the path - when the user goes back
            // we don't need to try to pop off the last item
            ArrayList<String> _path = new ArrayList<>(path);
            _path.add(item.name);
            Intent intent = new Intent(this, PropertyDetailActivity.class);
            intent.putStringArrayListExtra(PropertyDetailActivity.ARG_PATH, _path);
            startActivity(intent);
        } else {
            path.add(item.name);

            ArrayList<StyleDictionaryNode> nodeList = StyleDictionaryHelper.getArrayAtPath(path);

            // Create new fragment and transaction
            Fragment newFragment = PropertyFragment.newInstance(nodeList);
            newFragment.setExitTransition( new Slide(Gravity.LEFT) );
            newFragment.setEnterTransition( new Slide(Gravity.RIGHT) );
            FragmentTransaction transaction = getFragmentManager().beginTransaction();

            transaction.add(R.id.activity_properties, newFragment, item.name);
            transaction.addToBackStack(item.name);

            // Commit the transaction
            transaction.commit();
        }
    }

    @Override
    public void onBackPressed() {
        if (getFragmentManager().getBackStackEntryCount() > 0) {
            getFragmentManager().popBackStack();
            if (path.size() >= 1) {
                path.remove(path.size() - 1);
            }
        } else {
            super.onBackPressed();
        }
    }
}
