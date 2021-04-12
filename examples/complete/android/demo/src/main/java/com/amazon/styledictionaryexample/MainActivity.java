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

package com.amazon.styledictionaryexample;

import android.content.Intent;
import android.graphics.Typeface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.amazon.styledictionaryexample.color.ColorsActivity;
import com.amazon.styledictionaryexample.icon.IconListActivity;
import com.amazon.styledictionaryexample.property.PropertiesActivity;
import com.amazon.styledictionaryexample.util.StyleDictionaryHelper;

public class MainActivity extends BaseActivity {
    private static final String TAG = MainActivity.class.getSimpleName();
    private Typeface iconFont;

    Button propertiesButton;
    Button colorsButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        StyleDictionaryHelper.loadJSON(this);
        propertiesButton = findViewById(R.id.activity_main_properties_button);
        colorsButton = findViewById(R.id.activity_main_colors_button);
    }

    public void colorsButton(View view) {
        Intent colorsIntent = new Intent(this, ColorsActivity.class);
        startActivity(colorsIntent);
    }

    public void propertiesButton(View view) {
        Intent propertiesIntent = new Intent(this, PropertiesActivity.class);
        startActivity(propertiesIntent);
    }

    public void iconsButton(View view) {
        Intent iconsIntent = new Intent(this, IconListActivity.class);
        startActivity(iconsIntent);
    }
}
