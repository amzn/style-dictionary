/**
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

package com.amazon.styledictionaryexample.util;

import android.content.Context;

import com.amazon.styledictionaryexample.models.Property;
import com.amazon.styledictionaryexample.models.StyleDictionaryNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsonorg.JsonOrgModule;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;

public class StyleDictionaryHelper {

    public static ObjectMapper MAPPER;
    public static String DICTIONARY_JSON_STRING;
    public static JSONObject DICTIONARY_JSON;
    static {
        MAPPER = new ObjectMapper().registerModule(new JsonOrgModule());
    }

    public static void loadJSON(Context context) {
        DICTIONARY_JSON_STRING = loadJsonFromAsset("data/properties.json", context);
        try {
            DICTIONARY_JSON = new JSONObject(DICTIONARY_JSON_STRING);
        } catch  (JSONException e) {
            e.printStackTrace();
        }
    }

    public static ArrayList<StyleDictionaryNode> getNodeArrayForObject(JSONObject json) {
        final ArrayList<StyleDictionaryNode> nodeList = new ArrayList<>();
        Iterator<String> keys = json.keys();
        while(keys.hasNext()) {
            String key = keys.next();
            StyleDictionaryNode node = new StyleDictionaryNode();
            node.name = key;
            try {
                JSONObject jsonNode = json.getJSONObject(key);
                if (jsonNode.has("value")) {
                    node.isLeaf = true;
                } else {
                    node.count = jsonNode.length();
                }
            } catch  (JSONException e) {
                e.printStackTrace();
            }
            nodeList.add(node);
        }
        return nodeList;
    }

    public static ArrayList<StyleDictionaryNode> getArrayAtPath(ArrayList<String> path) {
        final ArrayList<StyleDictionaryNode> nodeList = new ArrayList<>();
        JSONObject json = DICTIONARY_JSON;
        try {
            for (String pathPart : path) {
                json = json.getJSONObject(pathPart);
            }

            return getNodeArrayForObject(json);
        } catch  (JSONException e) {
            e.printStackTrace();
        }

        return nodeList;
    }

    public static JSONObject getObjectAtPath(ArrayList<String> path) {
        JSONObject json = DICTIONARY_JSON;
        try {
            for (String pathPart : path) {
                json = json.getJSONObject(pathPart);
            }
        } catch  (JSONException e) {
            e.printStackTrace();
        }

        return json;
    }

    public static JSONObject getObjectAtPath(ArrayList<String> path, JSONObject json) {
        try {
            for (String pathPart : path) {
                json = json.getJSONObject(pathPart);
            }
        } catch  (JSONException e) {
            e.printStackTrace();
        }

        return json;
    }


    public static Property getProperty(ArrayList<String> path, JSONObject json) {
        Property property;
        try {
            for (String pathPart : path) {
                json = json.getJSONObject(pathPart);
            }

            if (json.has("value")) {
                property = MAPPER.convertValue(json, Property.class);
                return property;
            } else {
                throw new RuntimeException("Property doesn't exist");
            }
        } catch  (JSONException e) {
            e.printStackTrace();
        }
        return new Property();
    }

    public static Property getProperty(ArrayList<String> path) {
        return getProperty(path, DICTIONARY_JSON);
    }


    public static ArrayList<Property> getArrayOfProps(ArrayList<String> path) {
        final ArrayList<Property> propertyList = new ArrayList<>();
        JSONObject json = DICTIONARY_JSON;

        try {
            for (String pathPart : path) {
                json = json.getJSONObject(pathPart);
            }
            Iterator<String> keys = json.keys();

            while(keys.hasNext()) {
                String key = keys.next();
                JSONObject jsonProperty = json.getJSONObject(key);
                if (jsonProperty.has("value")) {
                    Property property = MAPPER.convertValue(jsonProperty, Property.class);
                    propertyList.add(property);
                }
            }
        } catch  (JSONException e) {
            e.printStackTrace();
        }

        return propertyList;
    }


    public static String loadJsonFromAsset(String filename, Context context) {
        String json = null;

        try {
            InputStream is = context.getAssets().open(filename);
            int size = is.available();
            byte[] buffer = new byte[size];
            is.read(buffer);
            is.close();
            json = new String(buffer, "UTF-8");
        }
        catch (java.io.IOException ex) {
            ex.printStackTrace();
            return null;
        }

        return json;
    }
}
