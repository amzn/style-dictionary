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
import android.widget.Button;

import com.amazon.styledictionaryexample.BaseActivity;
import com.amazon.styledictionaryexample.R;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class ColorsActivity extends BaseActivity {

    private static final String TAG = ColorsActivity.class.getSimpleName();

    @BindView(R.id.activity_colors_base_button)
    Button baseButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_colors);
        ButterKnife.bind(this);
    }

    @OnClick(R.id.activity_colors_base_button)
    public void baseButton() {
        Intent baseColorIntent = new Intent(this, BaseColorActivity.class);
        startActivity(baseColorIntent);
    }

    @OnClick(R.id.activity_colors_background_button)
    public void backgroundButton() {
        Intent backgroundColorIntent = new Intent(this, BackgroundColorActivity.class);
        startActivity(backgroundColorIntent);
    }

    @OnClick(R.id.activity_colors_font_button)
    public void fontButton() {
        Intent fontColorIntent = new Intent(this, FontColorActivity.class);
        startActivity(fontColorIntent);
    }

}
