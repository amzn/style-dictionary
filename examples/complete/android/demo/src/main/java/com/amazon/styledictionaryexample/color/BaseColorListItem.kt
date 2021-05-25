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
  val property: Property

  class BaseColorItem(override val property: Property) : BaseColorListItem {
    override val title: String? = property.attributes["subitem"]
    override val subtitle: String = property.value

    override val isHeader: Boolean
      get() = false
  }

  class BaseColorHeaderItem(override var property: Property) : BaseColorListItem {
    override val title: String? = property.attributes["item"]
    override val subtitle: String = property.name

    override val isHeader: Boolean
      get() = true
  }
}