/**
 * Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */
package com.amazon.styledictionaryexample.util

import android.content.Context
import com.amazon.styledictionaryexample.models.Property
import com.amazon.styledictionaryexample.models.StyleDictionaryNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsonorg.JsonOrgModule
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException
import java.util.*

object StyleDictionaryHelper {
  var MAPPER: ObjectMapper? = null
  var DICTIONARY_JSON_STRING: String? = null
  var DICTIONARY_JSON: JSONObject? = null
  fun loadJSON(context: Context) {
    DICTIONARY_JSON_STRING = loadJsonFromAsset("data/properties.json", context)
    try {
      DICTIONARY_JSON = JSONObject(DICTIONARY_JSON_STRING)
    } catch (e: JSONException) {
      e.printStackTrace()
    }
  }

  fun getNodeArrayForObject(json: JSONObject?): ArrayList<StyleDictionaryNode> {
    val nodeList = ArrayList<StyleDictionaryNode>()
    val keys = json!!.keys()
    while (keys.hasNext()) {
      val key = keys.next()
      val node = StyleDictionaryNode()
      node.name = key
      try {
        val jsonNode = json.getJSONObject(key)
        if (jsonNode.has("value")) {
          node.isLeaf = true
        } else {
          node.count = jsonNode.length()
        }
      } catch (e: JSONException) {
        e.printStackTrace()
      }
      nodeList.add(node)
    }
    return nodeList
  }

  fun getArrayAtPath(path: ArrayList<String?>): ArrayList<StyleDictionaryNode> {
    val nodeList = ArrayList<StyleDictionaryNode>()
    var json = DICTIONARY_JSON
    try {
      for (pathPart in path) {
        json = json!!.getJSONObject(pathPart)
      }
      return getNodeArrayForObject(json)
    } catch (e: JSONException) {
      e.printStackTrace()
    }
    return nodeList
  }

  fun getObjectAtPath(path: ArrayList<String?>): JSONObject? {
    var json = DICTIONARY_JSON
    try {
      for (pathPart in path) {
        json = json!!.getJSONObject(pathPart)
      }
    } catch (e: JSONException) {
      e.printStackTrace()
    }
    return json
  }

  fun getObjectAtPath(path: ArrayList<String?>, json: JSONObject): JSONObject {
    var json = json
    try {
      for (pathPart in path) {
        json = json.getJSONObject(pathPart)
      }
    } catch (e: JSONException) {
      e.printStackTrace()
    }
    return json
  }

  fun getProperty(path: ArrayList<String?>, json: JSONObject?): Property {
    var json = json
    val property: Property
    try {
      for (pathPart in path) {
        json = json!!.getJSONObject(pathPart)
      }
      return if (json!!.has("value")) {
        property = MAPPER!!.convertValue(json, Property::class.java)
        property
      } else {
        throw RuntimeException("Property doesn't exist")
      }
    } catch (e: JSONException) {
      e.printStackTrace()
    }
    return Property()
  }

  fun getProperty(path: ArrayList<String?>): Property {
    return getProperty(path, DICTIONARY_JSON)
  }

  fun getArrayOfProps(path: ArrayList<String?>): ArrayList<Property> {
    val propertyList = ArrayList<Property>()
    var json = DICTIONARY_JSON
    try {
      for (pathPart in path) {
        json = json!!.getJSONObject(pathPart)
      }
      val keys = json!!.keys()
      while (keys.hasNext()) {
        val key = keys.next()
        val jsonProperty = json.getJSONObject(key)
        if (jsonProperty.has("value")) {
          val property = MAPPER!!.convertValue(jsonProperty, Property::class.java)
          propertyList.add(property)
        }
      }
    } catch (e: JSONException) {
      e.printStackTrace()
    }
    return propertyList
  }

  fun loadJsonFromAsset(filename: String?, context: Context): String? {
    var json: String? = null
    json = try {
      val `is` = context.assets.open(filename!!)
      val size = `is`.available()
      val buffer = ByteArray(size)
      `is`.read(buffer)
      `is`.close()
      String(buffer, "UTF-8")
    } catch (ex: IOException) {
      ex.printStackTrace()
      return null
    }
    return json
  }

  init {
    MAPPER = ObjectMapper().registerModule(JsonOrgModule())
  }
}