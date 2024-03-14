/* @web/test-runner snapshot v1 */
export const snapshots = {};

snapshots["formats all should match css/variables snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

:root {
  --color_red: #FF0000; /* comment */
}
`;
/* end snapshot formats all should match css/variables snapshot */

snapshots["formats all should match scss/map-flat snapshot"] = 
`
/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

$tokens: (
  // comment
  'color_red': #FF0000
);`;
/* end snapshot formats all should match scss/map-flat snapshot */

snapshots["formats all should match scss/map-deep snapshot"] = 
`
/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

$color_red: #FF0000 !default; // comment

$tokens: (
  'color': (
    'red': $color_red
  )
);
`;
/* end snapshot formats all should match scss/map-deep snapshot */

snapshots["formats all should match scss/variables snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

$color_red: #FF0000; // comment
`;
/* end snapshot formats all should match scss/variables snapshot */

snapshots["formats all should match scss/icons snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

`;
/* end snapshot formats all should match scss/icons snapshot */

snapshots["formats all should match less/variables snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

@color_red: #FF0000; // comment
`;
/* end snapshot formats all should match less/variables snapshot */

snapshots["formats all should match less/icons snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

`;
/* end snapshot formats all should match less/icons snapshot */

snapshots["formats all should match stylus/variables snapshot"] = 
`
// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT

$color_red= #FF0000; // comment
`;
/* end snapshot formats all should match stylus/variables snapshot */

snapshots["formats all should match javascript/module snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

module.exports = {
  "color": {
    "red": {
      "value": "#FF0000",
      "type": "color",
      "original": {
        "value": "#FF0000"
      },
      "name": "color_red",
      "comment": "comment",
      "path": [
        "color",
        "red"
      ]
    }
  }
};
`;
/* end snapshot formats all should match javascript/module snapshot */

snapshots["formats all should match javascript/module-flat snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

module.exports = {
  "color_red": "#FF0000"
};
`;
/* end snapshot formats all should match javascript/module-flat snapshot */

snapshots["formats all should match javascript/object snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

var _styleDictionary = {
  "color": {
    "red": {
      "value": "#FF0000",
      "type": "color",
      "original": {
        "value": "#FF0000"
      },
      "name": "color_red",
      "comment": "comment",
      "path": [
        "color",
        "red"
      ]
    }
  }
};
`;
/* end snapshot formats all should match javascript/object snapshot */

snapshots["formats all should match javascript/umd snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else if (typeof exports === "object") {
    exports["_styleDictionary"] = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root["_styleDictionary"] = factory();
  }
}(this, function() {
  return {
  "color": {
    "red": {
      "value": "#FF0000",
      "type": "color",
      "original": {
        "value": "#FF0000"
      },
      "name": "color_red",
      "comment": "comment",
      "path": [
        "color",
        "red"
      ]
    }
  }
};
}))
`;
/* end snapshot formats all should match javascript/umd snapshot */

snapshots["formats all should match javascript/es6 snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

export const color_red = "#FF0000"; // comment
`;
/* end snapshot formats all should match javascript/es6 snapshot */

snapshots["formats all should match typescript/es6-declarations snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

/** comment */
export const color_red : string;
`;
/* end snapshot formats all should match typescript/es6-declarations snapshot */

snapshots["formats all should match typescript/module-declarations snapshot"] = 
`/**
 * Do not edit directly
 * Generated on Sat, 01 Jan 2000 00:00:00 GMT
 */

export default tokens;

declare interface DesignToken {
  value?: any;
  type?: string;
  comment?: string;
  name?: string;
  themeable?: boolean;
  attributes?: Record<string, unknown>;
  [key: string]: any;
}

declare const tokens: {
  "color": {
    "red": DesignToken
  }
}
`;
/* end snapshot formats all should match typescript/module-declarations snapshot */

snapshots["formats all should match android/resources snapshot"] = 
`<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<resources>
  <color name="color_red">#FF0000</color><!-- comment -->
</resources>`;
/* end snapshot formats all should match android/resources snapshot */

snapshots["formats all should match android/colors snapshot"] = 
`<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<resources>
  <color name="color_red">#FF0000</color><!-- comment -->
  
</resources>`;
/* end snapshot formats all should match android/colors snapshot */

snapshots["formats all should match android/dimens snapshot"] = 
`xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<resources>
  
</resources>`;
/* end snapshot formats all should match android/dimens snapshot */

snapshots["formats all should match android/fontDimens snapshot"] = 
`<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<resources>
  
</resources>`;
/* end snapshot formats all should match android/fontDimens snapshot */

snapshots["formats all should match android/integers snapshot"] = 
`<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<resources>
  
</resources>`;
/* end snapshot formats all should match android/integers snapshot */

snapshots["formats all should match android/strings snapshot"] = 
`<?xml version="1.0" encoding="UTF-8"?>

<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<resources>
  
</resources>`;
/* end snapshot formats all should match android/strings snapshot */

snapshots["formats all should match compose/object snapshot"] = 
`

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT



package ;

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.*

object  {
  /** comment */
  val color_red = #FF0000
}`;
/* end snapshot formats all should match compose/object snapshot */

snapshots["formats all should match ios/macros snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

#define color_red #FF0000
`;
/* end snapshot formats all should match ios/macros snapshot */

snapshots["formats all should match ios/plist snapshot"] = 
`
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!--
  Do not edit directly
  Generated on Sat, 01 Jan 2000 00:00:00 GMT
-->
<plist version="1.0">
  <dict>
    <key>color_red</key>
    <dict>
      <key>r</key>
      <real>NaN</real>
      <key>g</key>
      <real>NaN</real>
      <key>b</key>
      <real>NaN</real>
      <key>a</key>
      <real>1</real>
      </dict>
    <!-- comment -->
  </dict>
</plist>`;
/* end snapshot formats all should match ios/plist snapshot */

snapshots["formats all should match ios/singleton.m snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import ".h"

@implementation 

+ (NSDictionary *)getProperty:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:keyPath];
}

+ (nonnull)getValue:(NSString *)keyPath {
  return [[self properties] valueForKeyPath:[NSString stringWithFormat:@"%@.value", keyPath]];
}

+ (NSDictionary *)properties {
  static NSDictionary * dictionary;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    dictionary = @{
  @"color": @{
    @"red": @{
      @"value": #FF0000,
      @"name": @"color_red"
      }
    }
  };
  });

  return dictionary;
}

@end

`;
/* end snapshot formats all should match ios/singleton.m snapshot */

snapshots["formats all should match ios/singleton.h snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface  : NSObject

+ (NSDictionary *)properties;
+ (NSDictionary *)getProperty:(NSString *)keyPath;
+ (nonnull)getValue:(NSString *)keyPath;

@end`;
/* end snapshot formats all should match ios/singleton.h snapshot */

snapshots["formats all should match ios/static.h snapshot"] = 
`
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import <Foundation/Foundation.h>


extern  const color_red;`;
/* end snapshot formats all should match ios/static.h snapshot */

snapshots["formats all should match ios/static.m snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import ".h"


 const color_red = #FF0000;`;
/* end snapshot formats all should match ios/static.m snapshot */

snapshots["formats all should match ios/colors.h snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, ) {
color_red
};

@interface  : NSObject
+ (NSArray *)values;
+ (UIColor *)color:()color;
@end`;
/* end snapshot formats all should match ios/colors.h snapshot */

snapshots["formats all should match ios/colors.m snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import ".h"

@implementation 

+ (UIColor *)color:()colorEnum{
  return [[self values] objectAtIndex:colorEnum];
}

+ (NSArray *)values {
  static NSArray* colorArray;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    colorArray = @[
#FF0000
    ];
  });

  return colorArray;
}

@end`;
/* end snapshot formats all should match ios/colors.m snapshot */

snapshots["formats all should match ios/strings.h snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import <Foundation/Foundation.h>


extern NSString * const color_red;

@interface  : NSObject
+ (NSArray *)values;
@end`;
/* end snapshot formats all should match ios/strings.h snapshot */

snapshots["formats all should match ios/strings.m snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import ".h"


NSString * const color_red = #FF0000;

@implementation 

+ (NSArray *)values {
  static NSArray* array;
  static dispatch_once_t onceToken;

  dispatch_once(&onceToken, ^{
    array = @[
      @{
  @"value": #FF0000,
  @"name": @"color_red"
  }
    ];
  });

  return array;
}

@end

`;
/* end snapshot formats all should match ios/strings.m snapshot */

snapshots["formats all should match ios-swift/class.swift snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit

public class  {
    public static let color_red = #FF0000 /* comment */
}`;
/* end snapshot formats all should match ios-swift/class.swift snapshot */

snapshots["formats all should match ios-swift/enum.swift snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit

public enum  {
    public static let color_red = #FF0000 /* comment */
}`;
/* end snapshot formats all should match ios-swift/enum.swift snapshot */

snapshots["formats all should match ios-swift/any.swift snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


import UIKit

public class  {
    public static let color_red = #FF0000 /* comment */
}`;
/* end snapshot formats all should match ios-swift/any.swift snapshot */

snapshots["formats all should match json snapshot"] = 
`{
  "color": {
    "red": {
      "value": "#FF0000",
      "type": "color",
      "original": {
        "value": "#FF0000"
      },
      "name": "color_red",
      "comment": "comment",
      "path": [
        "color",
        "red"
      ]
    }
  }
}
`;
/* end snapshot formats all should match json snapshot */

snapshots["formats all should match json/asset snapshot"] = 
`{}`;
/* end snapshot formats all should match json/asset snapshot */

snapshots["formats all should match json/nested snapshot"] = 
`{
  "color": {
    "red": "#FF0000"
  }
}
`;
/* end snapshot formats all should match json/nested snapshot */

snapshots["formats all should match json/flat snapshot"] = 
`{
  "color_red": "#FF0000"
}
`;
/* end snapshot formats all should match json/flat snapshot */

snapshots["formats all should match sketch/palette snapshot"] = 
`{
  "compatibleVersion": "1.0",
  "pluginVersion": "1.1",
  "colors": [
    "#FF0000"
  ]
}
`;
/* end snapshot formats all should match sketch/palette snapshot */

snapshots["formats all should match sketch/palette/v2 snapshot"] = 
`{
  "compatibleVersion": "2.0",
  "pluginVersion": "2.2",
  "colors": [
    {
      "0": "#",
      "1": "F",
      "2": "F",
      "3": "0",
      "4": "0",
      "5": "0",
      "6": "0",
      "name": "color_red"
    }
  ]
}
`;
/* end snapshot formats all should match sketch/palette/v2 snapshot */

snapshots["formats all should match flutter/class.dart snapshot"] = 
`
//
// __output/
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT



import 'dart:ui';

class  {
  ._();

    static const color_red = #FF0000; /* comment */
}`;
/* end snapshot formats all should match flutter/class.dart snapshot */

snapshots["formats all should match css/fonts.css snapshot"] = 
``;
/* end snapshot formats all should match css/fonts.css snapshot */

snapshots["formats all should match registerCustomFormatWithNewArgs snapshot"] = 
`{
  "dictionary": {
    "tokens": {
      "color": {
        "red": {
          "value": "#FF0000",
          "original": {
            "value": "#FF0000"
          },
          "name": "color_red",
          "comment": "comment",
          "attributes": {
            "category": "color",
            "type": "red"
          },
          "path": [
            "color",
            "red"
          ]
        }
      }
    },
    "allTokens": [
      {
        "value": "#FF0000",
        "original": {
          "value": "#FF0000"
        },
        "name": "color_red",
        "comment": "comment",
        "attributes": {
          "category": "color",
          "type": "red"
        },
        "path": [
          "color",
          "red"
        ]
      }
    ]
  },
  "allTokens": [
    {
      "value": "#FF0000",
      "original": {
        "value": "#FF0000"
      },
      "name": "color_red",
      "comment": "comment",
      "attributes": {
        "category": "color",
        "type": "red"
      },
      "path": [
        "color",
        "red"
      ]
    }
  ],
  "tokens": {
    "color": {
      "red": {
        "value": "#FF0000",
        "original": {
          "value": "#FF0000"
        },
        "name": "color_red",
        "comment": "comment",
        "attributes": {
          "category": "color",
          "type": "red"
        },
        "path": [
          "color",
          "red"
        ]
      }
    }
  },
  "platform": {},
  "file": {
    "destination": "__output/",
    "format": "javascript/es6",
    "filter": {
      "attributes": {
        "category": "color"
      }
    }
  },
  "options": {}
}`;
/* end snapshot formats all should match registerCustomFormatWithNewArgs snapshot */

