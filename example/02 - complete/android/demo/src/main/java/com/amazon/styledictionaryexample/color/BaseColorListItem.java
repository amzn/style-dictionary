/**
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package com.amazon.styledictionaryexample.color;

import com.amazon.styledictionaryexample.models.Property;

public interface BaseColorListItem {
    boolean isHeader();
    String getTitle();
    String getSubtitle();
    Property getProperty();


    class BaseColorItem implements BaseColorListItem {
        private final String title;
        private final String subtitle;
        public Property property;

        public BaseColorItem(String t, String s) {
            title = t;
            subtitle = s;
        }

        public BaseColorItem(Property p) {
            property = p;
            title = p.attributes.get("subitem");
            subtitle = p.value;
        }

        public Property getProperty() { return property; }
        public String getTitle() { return title; }
        public String getSubtitle() { return subtitle; }
        public boolean isHeader() { return false; }
    }

    class BaseColorHeaderItem implements BaseColorListItem {
        private final String title;
        private final String subtitle;
        public Property property;

        public BaseColorHeaderItem(String t, String s) {
            title = t;
            subtitle = s;
        }

        public BaseColorHeaderItem(Property p) {
            property = p;
            title = p.attributes.get("item");
            subtitle = p.name;
        }

        public Property getProperty() { return property; }
        public String getTitle() { return title; }
        public String getSubtitle() { return subtitle; }
        public boolean isHeader() { return true; }
    }
}


