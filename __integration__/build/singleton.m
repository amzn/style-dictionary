
//
// singleton.m
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import "StyleDictionary.h"

@implementation StyleDictionary

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
    @"background": @{
      @"primary": @{
        @"value": [UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
        @"name": @"ColorBackgroundPrimary",
        @"category": @"color",
        @"type": @"background",
        @"item": @"primary"
        },
      @"secondary": @{
        @"value": [UIColor colorWithRed:0.953f green:0.957f blue:0.957f alpha:1.000f],
        @"name": @"ColorBackgroundSecondary",
        @"category": @"color",
        @"type": @"background",
        @"item": @"secondary"
        },
      @"tertiary": @{
        @"value": [UIColor colorWithRed:0.871f green:0.882f blue:0.882f alpha:1.000f],
        @"name": @"ColorBackgroundTertiary",
        @"category": @"color",
        @"type": @"background",
        @"item": @"tertiary"
        },
      @"danger": @{
        @"value": [UIColor colorWithRed:1.000f green:0.918f blue:0.914f alpha:1.000f],
        @"name": @"ColorBackgroundDanger",
        @"category": @"color",
        @"type": @"background",
        @"item": @"danger"
        },
      @"warning": @{
        @"value": [UIColor colorWithRed:1.000f green:0.929f blue:0.890f alpha:1.000f],
        @"name": @"ColorBackgroundWarning",
        @"category": @"color",
        @"type": @"background",
        @"item": @"warning"
        },
      @"success": @{
        @"value": [UIColor colorWithRed:0.922f green:0.976f blue:0.922f alpha:1.000f],
        @"name": @"ColorBackgroundSuccess",
        @"category": @"color",
        @"type": @"background",
        @"item": @"success"
        },
      @"info": @{
        @"value": [UIColor colorWithRed:0.914f green:0.973f blue:1.000f alpha:1.000f],
        @"name": @"ColorBackgroundInfo",
        @"category": @"color",
        @"type": @"background",
        @"item": @"info"
        },
      @"disabled": @{
        @"value": [UIColor colorWithRed:0.871f green:0.882f blue:0.882f alpha:1.000f],
        @"name": @"ColorBackgroundDisabled",
        @"category": @"color",
        @"type": @"background",
        @"item": @"disabled"
        }
      },
    @"border": @{
      @"primary": @{
        @"value": [UIColor colorWithRed:0.784f green:0.800f blue:0.800f alpha:1.000f],
        @"name": @"ColorBorderPrimary",
        @"category": @"color",
        @"type": @"border",
        @"item": @"primary"
        },
      @"secondary": @
        },
      @"tertiary": @
        }
      },
    @"brand": @{
      @"primary": @{
        @"value": [UIColor colorWithRed:0.043f green:0.522f blue:0.600f alpha:1.000f],
        @"name": @"ColorBrandPrimary",
        @"category": @"color",
        @"type": @"brand",
        @"item": @"primary"
        },
      @"secondary": @{
        @"value": [UIColor colorWithRed:0.435f green:0.369f blue:0.827f alpha:1.000f],
        @"name": @"ColorBrandSecondary",
        @"category": @"color",
        @"type": @"brand",
        @"item": @"secondary"
        }
      },
    @"core": @{
      @"green": @{
        @"0": @{
          @"value": [UIColor colorWithRed:0.922f green:0.976f blue:0.922f alpha:1.000f],
          @"name": @"ColorCoreGreen0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.843f green:0.957f blue:0.843f alpha:1.000f],
          @"name": @"ColorCoreGreen100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.761f green:0.949f blue:0.741f alpha:1.000f],
          @"name": @"ColorCoreGreen200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.596f green:0.898f blue:0.557f alpha:1.000f],
          @"name": @"ColorCoreGreen300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.459f green:0.867f blue:0.400f alpha:1.000f],
          @"name": @"ColorCoreGreen400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.349f green:0.796f blue:0.349f alpha:1.000f],
          @"name": @"ColorCoreGreen500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.169f green:0.714f blue:0.337f alpha:1.000f],
          @"name": @"ColorCoreGreen600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.047f green:0.655f blue:0.314f alpha:1.000f],
          @"name": @"ColorCoreGreen700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.000f green:0.545f blue:0.275f alpha:1.000f],
          @"name": @"ColorCoreGreen800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.000f green:0.420f blue:0.251f alpha:1.000f],
          @"name": @"ColorCoreGreen900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.031f green:0.259f blue:0.184f alpha:1.000f],
          @"name": @"ColorCoreGreen1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.000f green:0.169f blue:0.125f alpha:1.000f],
          @"name": @"ColorCoreGreen1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"green",
          @"subitem": @"1100"
          }
        },
      @"teal": @{
        @"0": @{
          @"value": [UIColor colorWithRed:0.898f green:0.976f blue:0.961f alpha:1.000f],
          @"name": @"ColorCoreTeal0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.804f green:0.969f blue:0.937f alpha:1.000f],
          @"name": @"ColorCoreTeal100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.702f green:0.949f blue:0.902f alpha:1.000f],
          @"name": @"ColorCoreTeal200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.490f green:0.918f blue:0.835f alpha:1.000f],
          @"name": @"ColorCoreTeal300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.141f green:0.878f blue:0.773f alpha:1.000f],
          @"name": @"ColorCoreTeal400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.031f green:0.769f blue:0.698f alpha:1.000f],
          @"name": @"ColorCoreTeal500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.000f green:0.663f blue:0.612f alpha:1.000f],
          @"name": @"ColorCoreTeal600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.043f green:0.588f blue:0.561f alpha:1.000f],
          @"name": @"ColorCoreTeal700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.024f green:0.486f blue:0.486f alpha:1.000f],
          @"name": @"ColorCoreTeal800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.008f green:0.400f blue:0.380f alpha:1.000f],
          @"name": @"ColorCoreTeal900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.031f green:0.247f blue:0.247f alpha:1.000f],
          @"name": @"ColorCoreTeal1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.000f green:0.145f blue:0.157f alpha:1.000f],
          @"name": @"ColorCoreTeal1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"teal",
          @"subitem": @"1100"
          }
        },
      @"aqua": @{
        @"0": @{
          @"value": [UIColor colorWithRed:0.851f green:0.988f blue:0.984f alpha:1.000f],
          @"name": @"ColorCoreAqua0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.773f green:0.976f blue:0.976f alpha:1.000f],
          @"name": @"ColorCoreAqua100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.647f green:0.949f blue:0.949f alpha:1.000f],
          @"name": @"ColorCoreAqua200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.463f green:0.898f blue:0.886f alpha:1.000f],
          @"name": @"ColorCoreAqua300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.200f green:0.839f blue:0.886f alpha:1.000f],
          @"name": @"ColorCoreAqua400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.090f green:0.722f blue:0.808f alpha:1.000f],
          @"name": @"ColorCoreAqua500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.027f green:0.592f blue:0.682f alpha:1.000f],
          @"name": @"ColorCoreAqua600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.043f green:0.522f blue:0.600f alpha:1.000f],
          @"name": @"ColorCoreAqua700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.059f green:0.431f blue:0.518f alpha:1.000f],
          @"name": @"ColorCoreAqua800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.012f green:0.369f blue:0.451f alpha:1.000f],
          @"name": @"ColorCoreAqua900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.031f green:0.239f blue:0.310f alpha:1.000f],
          @"name": @"ColorCoreAqua1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.000f green:0.157f blue:0.220f alpha:1.000f],
          @"name": @"ColorCoreAqua1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"aqua",
          @"subitem": @"1100"
          }
        },
      @"blue": @{
        @"0": @{
          @"value": [UIColor colorWithRed:0.914f green:0.973f blue:1.000f alpha:1.000f],
          @"name": @"ColorCoreBlue0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.863f green:0.949f blue:1.000f alpha:1.000f],
          @"name": @"ColorCoreBlue100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.780f green:0.894f blue:0.976f alpha:1.000f],
          @"name": @"ColorCoreBlue200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.631f green:0.824f blue:0.973f alpha:1.000f],
          @"name": @"ColorCoreBlue300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.337f green:0.678f blue:0.961f alpha:1.000f],
          @"name": @"ColorCoreBlue400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.220f green:0.588f blue:0.890f alpha:1.000f],
          @"name": @"ColorCoreBlue500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.169f green:0.529f blue:0.827f alpha:1.000f],
          @"name": @"ColorCoreBlue600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.125f green:0.475f blue:0.765f alpha:1.000f],
          @"name": @"ColorCoreBlue700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.067f green:0.427f blue:0.667f alpha:1.000f],
          @"name": @"ColorCoreBlue800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.047f green:0.337f blue:0.537f alpha:1.000f],
          @"name": @"ColorCoreBlue900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.039f green:0.224f blue:0.376f alpha:1.000f],
          @"name": @"ColorCoreBlue1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.000f green:0.129f blue:0.220f alpha:1.000f],
          @"name": @"ColorCoreBlue1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"blue",
          @"subitem": @"1100"
          }
        },
      @"purple": @{
        @"0": @{
          @"value": [UIColor colorWithRed:0.949f green:0.949f blue:0.976f alpha:1.000f],
          @"name": @"ColorCorePurple0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.918f green:0.918f blue:0.976f alpha:1.000f],
          @"name": @"ColorCorePurple100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.847f green:0.843f blue:0.976f alpha:1.000f],
          @"name": @"ColorCorePurple200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.757f green:0.757f blue:0.969f alpha:1.000f],
          @"name": @"ColorCorePurple300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.631f green:0.576f blue:0.949f alpha:1.000f],
          @"name": @"ColorCorePurple400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.569f green:0.502f blue:0.957f alpha:1.000f],
          @"name": @"ColorCorePurple500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.506f green:0.435f blue:0.918f alpha:1.000f],
          @"name": @"ColorCorePurple600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.435f green:0.369f blue:0.827f alpha:1.000f],
          @"name": @"ColorCorePurple700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.369f green:0.306f blue:0.729f alpha:1.000f],
          @"name": @"ColorCorePurple800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.282f green:0.227f blue:0.612f alpha:1.000f],
          @"name": @"ColorCorePurple900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.176f green:0.141f blue:0.420f alpha:1.000f],
          @"name": @"ColorCorePurple1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.114f green:0.114f blue:0.220f alpha:1.000f],
          @"name": @"ColorCorePurple1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"purple",
          @"subitem": @"1100"
          }
        },
      @"magenta": @{
        @"0": @{
          @"value": [UIColor colorWithRed:0.996f green:0.941f blue:1.000f alpha:1.000f],
          @"name": @"ColorCoreMagenta0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.976f green:0.890f blue:0.988f alpha:1.000f],
          @"name": @"ColorCoreMagenta100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.957f green:0.769f blue:0.969f alpha:1.000f],
          @"name": @"ColorCoreMagenta200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.929f green:0.678f blue:0.949f alpha:1.000f],
          @"name": @"ColorCoreMagenta300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.949f green:0.510f blue:0.961f alpha:1.000f],
          @"name": @"ColorCoreMagenta400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.859f green:0.380f blue:0.859f alpha:1.000f],
          @"name": @"ColorCoreMagenta500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.769f green:0.306f blue:0.725f alpha:1.000f],
          @"name": @"ColorCoreMagenta600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.675f green:0.267f blue:0.659f alpha:1.000f],
          @"name": @"ColorCoreMagenta700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.561f green:0.220f blue:0.588f alpha:1.000f],
          @"name": @"ColorCoreMagenta800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.424f green:0.133f blue:0.467f alpha:1.000f],
          @"name": @"ColorCoreMagenta900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.271f green:0.082f blue:0.318f alpha:1.000f],
          @"name": @"ColorCoreMagenta1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.161f green:0.098f blue:0.176f alpha:1.000f],
          @"name": @"ColorCoreMagenta1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"magenta",
          @"subitem": @"1100"
          }
        },
      @"pink": @{
        @"0": @{
          @"value": [UIColor colorWithRed:1.000f green:0.914f blue:0.953f alpha:1.000f],
          @"name": @"ColorCorePink0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.988f green:0.859f blue:0.922f alpha:1.000f],
          @"name": @"ColorCorePink100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:1.000f green:0.710f blue:0.835f alpha:1.000f],
          @"name": @"ColorCorePink200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:1.000f green:0.584f blue:0.757f alpha:1.000f],
          @"name": @"ColorCorePink300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:1.000f green:0.463f blue:0.682f alpha:1.000f],
          @"name": @"ColorCorePink400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.937f green:0.345f blue:0.545f alpha:1.000f],
          @"name": @"ColorCorePink500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.878f green:0.267f blue:0.486f alpha:1.000f],
          @"name": @"ColorCorePink600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.808f green:0.212f blue:0.396f alpha:1.000f],
          @"name": @"ColorCorePink700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.698f green:0.184f blue:0.357f alpha:1.000f],
          @"name": @"ColorCorePink800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.576f green:0.094f blue:0.278f alpha:1.000f],
          @"name": @"ColorCorePink900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.337f green:0.071f blue:0.192f alpha:1.000f],
          @"name": @"ColorCorePink1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.169f green:0.090f blue:0.129f alpha:1.000f],
          @"name": @"ColorCorePink1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"pink",
          @"subitem": @"1100"
          }
        },
      @"red": @{
        @"0": @{
          @"value": [UIColor colorWithRed:1.000f green:0.918f blue:0.914f alpha:1.000f],
          @"name": @"ColorCoreRed0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:1.000f green:0.835f blue:0.824f alpha:1.000f],
          @"name": @"ColorCoreRed100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:1.000f green:0.722f blue:0.694f alpha:1.000f],
          @"name": @"ColorCoreRed200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:1.000f green:0.612f blue:0.561f alpha:1.000f],
          @"name": @"ColorCoreRed300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:1.000f green:0.498f blue:0.431f alpha:1.000f],
          @"name": @"ColorCoreRed400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.969f green:0.376f blue:0.329f alpha:1.000f],
          @"name": @"ColorCoreRed500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.929f green:0.298f blue:0.259f alpha:1.000f],
          @"name": @"ColorCoreRed600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.859f green:0.243f blue:0.243f alpha:1.000f],
          @"name": @"ColorCoreRed700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.776f green:0.204f blue:0.204f alpha:1.000f],
          @"name": @"ColorCoreRed800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.600f green:0.133f blue:0.133f alpha:1.000f],
          @"name": @"ColorCoreRed900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.427f green:0.075f blue:0.075f alpha:1.000f],
          @"name": @"ColorCoreRed1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.169f green:0.067f blue:0.067f alpha:1.000f],
          @"name": @"ColorCoreRed1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"red",
          @"subitem": @"1100"
          }
        },
      @"orange": @{
        @"0": @{
          @"value": [UIColor colorWithRed:1.000f green:0.929f blue:0.890f alpha:1.000f],
          @"name": @"ColorCoreOrange0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.988f green:0.863f blue:0.800f alpha:1.000f],
          @"name": @"ColorCoreOrange100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:1.000f green:0.776f blue:0.643f alpha:1.000f],
          @"name": @"ColorCoreOrange200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:1.000f green:0.694f blue:0.502f alpha:1.000f],
          @"name": @"ColorCoreOrange300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:1.000f green:0.612f blue:0.365f alpha:1.000f],
          @"name": @"ColorCoreOrange400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.988f green:0.537f blue:0.263f alpha:1.000f],
          @"name": @"ColorCoreOrange500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.961f green:0.490f blue:0.200f alpha:1.000f],
          @"name": @"ColorCoreOrange600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.929f green:0.439f blue:0.141f alpha:1.000f],
          @"name": @"ColorCoreOrange700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.808f green:0.333f blue:0.067f alpha:1.000f],
          @"name": @"ColorCoreOrange800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.588f green:0.173f blue:0.043f alpha:1.000f],
          @"name": @"ColorCoreOrange900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.376f green:0.090f blue:0.000f alpha:1.000f],
          @"name": @"ColorCoreOrange1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.176f green:0.075f blue:0.055f alpha:1.000f],
          @"name": @"ColorCoreOrange1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"orange",
          @"subitem": @"1100"
          }
        },
      @"neutral": @{
        @"0": @{
          @"value": [UIColor colorWithRed:1.000f green:1.000f blue:1.000f alpha:1.000f],
          @"name": @"ColorCoreNeutral0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.953f green:0.957f blue:0.957f alpha:1.000f],
          @"name": @"ColorCoreNeutral100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:0.871f green:0.882f blue:0.882f alpha:1.000f],
          @"name": @"ColorCoreNeutral200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:0.784f green:0.800f blue:0.800f alpha:1.000f],
          @"name": @"ColorCoreNeutral300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:0.690f green:0.714f blue:0.718f alpha:1.000f],
          @"name": @"ColorCoreNeutral400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:0.573f green:0.604f blue:0.608f alpha:1.000f],
          @"name": @"ColorCoreNeutral500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:0.431f green:0.475f blue:0.478f alpha:1.000f],
          @"name": @"ColorCoreNeutral600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.318f green:0.369f blue:0.373f alpha:1.000f],
          @"name": @"ColorCoreNeutral700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.212f green:0.255f blue:0.255f alpha:1.000f],
          @"name": @"ColorCoreNeutral800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.153f green:0.200f blue:0.200f alpha:1.000f],
          @"name": @"ColorCoreNeutral900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.086f green:0.125f blue:0.125f alpha:1.000f],
          @"name": @"ColorCoreNeutral1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.016f green:0.016f blue:0.016f alpha:1.000f],
          @"name": @"ColorCoreNeutral1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"neutral",
          @"subitem": @"1100"
          }
        },
      @"yellow": @{
        @"0": @{
          @"value": [UIColor colorWithRed:1.000f green:0.973f blue:0.886f alpha:1.000f],
          @"name": @"ColorCoreYellow0",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"0"
          },
        @"100": @{
          @"value": [UIColor colorWithRed:0.992f green:0.937f blue:0.804f alpha:1.000f],
          @"name": @"ColorCoreYellow100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"100"
          },
        @"200": @{
          @"value": [UIColor colorWithRed:1.000f green:0.914f blue:0.604f alpha:1.000f],
          @"name": @"ColorCoreYellow200",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"200"
          },
        @"300": @{
          @"value": [UIColor colorWithRed:1.000f green:0.882f blue:0.431f alpha:1.000f],
          @"name": @"ColorCoreYellow300",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"300"
          },
        @"400": @{
          @"value": [UIColor colorWithRed:1.000f green:0.851f blue:0.263f alpha:1.000f],
          @"name": @"ColorCoreYellow400",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"400"
          },
        @"500": @{
          @"value": [UIColor colorWithRed:1.000f green:0.804f blue:0.110f alpha:1.000f],
          @"name": @"ColorCoreYellow500",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"500"
          },
        @"600": @{
          @"value": [UIColor colorWithRed:1.000f green:0.737f blue:0.000f alpha:1.000f],
          @"name": @"ColorCoreYellow600",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"600"
          },
        @"700": @{
          @"value": [UIColor colorWithRed:0.867f green:0.600f blue:0.012f alpha:1.000f],
          @"name": @"ColorCoreYellow700",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"700"
          },
        @"800": @{
          @"value": [UIColor colorWithRed:0.729f green:0.459f blue:0.024f alpha:1.000f],
          @"name": @"ColorCoreYellow800",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"800"
          },
        @"900": @{
          @"value": [UIColor colorWithRed:0.580f green:0.298f blue:0.047f alpha:1.000f],
          @"name": @"ColorCoreYellow900",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"900"
          },
        @"1000": @{
          @"value": [UIColor colorWithRed:0.329f green:0.165f blue:0.000f alpha:1.000f],
          @"name": @"ColorCoreYellow1000",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"1000"
          },
        @"1100": @{
          @"value": [UIColor colorWithRed:0.176f green:0.102f blue:0.020f alpha:1.000f],
          @"name": @"ColorCoreYellow1100",
          @"category": @"color",
          @"type": @"core",
          @"item": @"yellow",
          @"subitem": @"1100"
          }
        }
      },
    @"font": @{
      @"primary": @{
        @"value": [UIColor colorWithRed:0.016f green:0.016f blue:0.016f alpha:1.000f],
        @"name": @"ColorFontPrimary",
        @"category": @"color",
        @"type": @"font",
        @"item": @"primary"
        },
      @"secondary": @{
        @"value": [UIColor colorWithRed:0.153f green:0.200f blue:0.200f alpha:1.000f],
        @"name": @"ColorFontSecondary",
        @"category": @"color",
        @"type": @"font",
        @"item": @"secondary"
        },
      @"tertiary": @{
        @"value": [UIColor colorWithRed:0.212f green:0.255f blue:0.255f alpha:1.000f],
        @"name": @"ColorFontTertiary",
        @"category": @"color",
        @"type": @"font",
        @"item": @"tertiary"
        },
      @"interactive": @{
        @"_": @{
          @"value": [UIColor colorWithRed:0.043f green:0.522f blue:0.600f alpha:1.000f],
          @"name": @"ColorFontInteractive",
          @"category": @"color",
          @"type": @"font",
          @"item": @"interactive",
          @"subitem": @"_"
          },
        @"hover": @{
          @"value": [UIColor colorWithRed:0.043f green:0.522f blue:0.600f alpha:1.000f],
          @"name": @"ColorFontInteractiveHover",
          @"category": @"color",
          @"type": @"font",
          @"item": @"interactive",
          @"subitem": @"hover"
          },
        @"active": @{
          @"value": [UIColor colorWithRed:0.435f green:0.369f blue:0.827f alpha:1.000f],
          @"name": @"ColorFontInteractiveActive",
          @"category": @"color",
          @"type": @"font",
          @"item": @"interactive",
          @"subitem": @"active"
          },
        @"disabled": @{
          @"value": [UIColor colorWithRed:0.212f green:0.255f blue:0.255f alpha:1.000f],
          @"name": @"ColorFontInteractiveDisabled",
          @"category": @"color",
          @"type": @"font",
          @"item": @"interactive",
          @"subitem": @"disabled"
          }
        },
      @"danger": @{
        @"value": [UIColor colorWithRed:0.427f green:0.075f blue:0.075f alpha:1.000f],
        @"name": @"ColorFontDanger",
        @"category": @"color",
        @"type": @"font",
        @"item": @"danger"
        },
      @"warning": @{
        @"value": [UIColor colorWithRed:0.376f green:0.090f blue:0.000f alpha:1.000f],
        @"name": @"ColorFontWarning",
        @"category": @"color",
        @"type": @"font",
        @"item": @"warning"
        },
      @"success": @{
        @"value": [UIColor colorWithRed:0.031f green:0.259f blue:0.184f alpha:1.000f],
        @"name": @"ColorFontSuccess",
        @"category": @"color",
        @"type": @"font",
        @"item": @"success"
        }
      }
    },
  @"size": @{
    @"border": @{
      @"radius": @{
        @"large": @{
          @"value": @480.00f,
          @"name": @"SizeBorderRadiusLarge",
          @"category": @"size",
          @"type": @"border",
          @"item": @"radius",
          @"subitem": @"large"
          }
        }
      },
    @"font": @{
      @"small": @{
        @"value": @12.00f,
        @"name": @"SizeFontSmall",
        @"category": @"size",
        @"type": @"font",
        @"item": @"small"
        },
      @"medium": @{
        @"value": @16.00f,
        @"name": @"SizeFontMedium",
        @"category": @"size",
        @"type": @"font",
        @"item": @"medium"
        },
      @"large": @{
        @"value": @24.00f,
        @"name": @"SizeFontLarge",
        @"category": @"size",
        @"type": @"font",
        @"item": @"large"
        },
      @"xl": @{
        @"value": @36.00f,
        @"name": @"SizeFontXl",
        @"category": @"size",
        @"type": @"font",
        @"item": @"xl"
        }
      },
    @"padding": @{
      @"small": @{
        @"value": @8.00f,
        @"name": @"SizePaddingSmall",
        @"category": @"size",
        @"type": @"padding",
        @"item": @"small"
        },
      @"medium": @{
        @"value": @16.00f,
        @"name": @"SizePaddingMedium",
        @"category": @"size",
        @"type": @"padding",
        @"item": @"medium"
        },
      @"large": @{
        @"value": @16.00f,
        @"name": @"SizePaddingLarge",
        @"category": @"size",
        @"type": @"padding",
        @"item": @"large"
        },
      @"xl": @{
        @"value": @16.00f,
        @"name": @"SizePaddingXl",
        @"category": @"size",
        @"type": @"padding",
        @"item": @"xl"
        }
      }
    }
  };
  });

  return dictionary;
}

@end

