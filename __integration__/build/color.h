
//
// color.h
//

// Do not edit directly
// Generated on Sat, 01 Jan 2000 00:00:00 GMT


#import <UIKit/UIKit.h>

typedef NS_ENUM(NSInteger, StyleDictionaryColorName) {
ColorBackgroundPrimary,
ColorBackgroundSecondary,
ColorBackgroundTertiary,
ColorBackgroundDanger,
ColorBackgroundWarning,
ColorBackgroundSuccess,
ColorBackgroundInfo,
ColorBackgroundDisabled,
ColorBorderPrimary,
ColorBrandPrimary,
ColorBrandSecondary,
ColorCoreGreen0,
ColorCoreGreen100,
ColorCoreGreen200,
ColorCoreGreen300,
ColorCoreGreen400,
ColorCoreGreen500,
ColorCoreGreen600,
ColorCoreGreen700,
ColorCoreGreen800,
ColorCoreGreen900,
ColorCoreGreen1000,
ColorCoreGreen1100,
ColorCoreTeal0,
ColorCoreTeal100,
ColorCoreTeal200,
ColorCoreTeal300,
ColorCoreTeal400,
ColorCoreTeal500,
ColorCoreTeal600,
ColorCoreTeal700,
ColorCoreTeal800,
ColorCoreTeal900,
ColorCoreTeal1000,
ColorCoreTeal1100,
ColorCoreAqua0,
ColorCoreAqua100,
ColorCoreAqua200,
ColorCoreAqua300,
ColorCoreAqua400,
ColorCoreAqua500,
ColorCoreAqua600,
ColorCoreAqua700,
ColorCoreAqua800,
ColorCoreAqua900,
ColorCoreAqua1000,
ColorCoreAqua1100,
ColorCoreBlue0,
ColorCoreBlue100,
ColorCoreBlue200,
ColorCoreBlue300,
ColorCoreBlue400,
ColorCoreBlue500,
ColorCoreBlue600,
ColorCoreBlue700,
ColorCoreBlue800,
ColorCoreBlue900,
ColorCoreBlue1000,
ColorCoreBlue1100,
ColorCorePurple0,
ColorCorePurple100,
ColorCorePurple200,
ColorCorePurple300,
ColorCorePurple400,
ColorCorePurple500,
ColorCorePurple600,
ColorCorePurple700,
ColorCorePurple800,
ColorCorePurple900,
ColorCorePurple1000,
ColorCorePurple1100,
ColorCoreMagenta0,
ColorCoreMagenta100,
ColorCoreMagenta200,
ColorCoreMagenta300,
ColorCoreMagenta400,
ColorCoreMagenta500,
ColorCoreMagenta600,
ColorCoreMagenta700,
ColorCoreMagenta800,
ColorCoreMagenta900,
ColorCoreMagenta1000,
ColorCoreMagenta1100,
ColorCorePink0,
ColorCorePink100,
ColorCorePink200,
ColorCorePink300,
ColorCorePink400,
ColorCorePink500,
ColorCorePink600,
ColorCorePink700,
ColorCorePink800,
ColorCorePink900,
ColorCorePink1000,
ColorCorePink1100,
ColorCoreRed0,
ColorCoreRed100,
ColorCoreRed200,
ColorCoreRed300,
ColorCoreRed400,
ColorCoreRed500,
ColorCoreRed600,
ColorCoreRed700,
ColorCoreRed800,
ColorCoreRed900,
ColorCoreRed1000,
ColorCoreRed1100,
ColorCoreOrange0,
ColorCoreOrange100,
ColorCoreOrange200,
ColorCoreOrange300,
ColorCoreOrange400,
ColorCoreOrange500,
ColorCoreOrange600,
ColorCoreOrange700,
ColorCoreOrange800,
ColorCoreOrange900,
ColorCoreOrange1000,
ColorCoreOrange1100,
ColorCoreNeutral0,
ColorCoreNeutral100,
ColorCoreNeutral200,
ColorCoreNeutral300,
ColorCoreNeutral400,
ColorCoreNeutral500,
ColorCoreNeutral600,
ColorCoreNeutral700,
ColorCoreNeutral800,
ColorCoreNeutral900,
ColorCoreNeutral1000,
ColorCoreNeutral1100,
ColorCoreYellow0,
ColorCoreYellow100,
ColorCoreYellow200,
ColorCoreYellow300,
ColorCoreYellow400,
ColorCoreYellow500,
ColorCoreYellow600,
ColorCoreYellow700,
ColorCoreYellow800,
ColorCoreYellow900,
ColorCoreYellow1000,
ColorCoreYellow1100,
ColorFontPrimary,
ColorFontSecondary,
ColorFontTertiary,
ColorFontInteractive,
ColorFontInteractiveHover,
ColorFontInteractiveActive,
ColorFontInteractiveDisabled,
ColorFontDanger,
ColorFontWarning,
ColorFontSuccess
};

@interface StyleDictionaryColor : NSObject
+ (NSArray *)values;
+ (UIColor *)color:(StyleDictionaryColorName)color;
@end