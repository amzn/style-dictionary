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
package com.amazon.styledictionaryexample.color

import com.amazon.styledictionaryexample.models.Property

interface BaseColorListItem {
  val isHeader: Boolean
  val title: String?
  val subtitle: String
  val property: Property?

  class BaseColorItem : BaseColorListItem {
    override val title: String?
    override val subtitle: String
    override var property: Property? = null

    constructor(t: String?, s: String) {
      title = t
      subtitle = s
    }

    constructor(p: Property) {
      property = p
      title = p.attributes["subitem"]
      subtitle = p.value
    }

    override fun isHeader(): Boolean {
      return false
    }
  }

  class BaseColorHeaderItem : BaseColorListItem {
    override val title: String?
    override val subtitle: String
    override var property: Property? = null

    constructor(t: String?, s: String) {
      title = t
      subtitle = s
    }

    constructor(p: Property) {
      property = p
      title = p.attributes["item"]
      subtitle = p.name
    }

    override fun isHeader(): Boolean {
      return true
    }
  }
}