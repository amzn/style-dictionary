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

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;


public class ColorsActivity extends BaseActivity {

    private static final String TAG = ColorsActivity.class.getSimpleName();

    Button baseButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_colors);
        baseButton = findViewById(R.id.activity_colors_base_button);
    }

    public void baseButton(View view) {
        Intent baseColorIntent = new Intent(this, BaseColorActivity.class);
        startActivity(baseColorIntent);
    }

    public void backgroundButton(View view) {
        Intent backgroundColorIntent = new Intent(this, BackgroundColorActivity.class);
        startActivity(backgroundColorIntent);
    }

    public void fontButton(View view) {
        Intent fontColorIntent = new Intent(this, FontColorActivity.class);
        startActivity(fontColorIntent);
    }

}
