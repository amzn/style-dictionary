//
//  StyleDictionaryButton.h
//  Pods
//
//  Created by Banks, Daniel on 1/29/17.
//
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "UIColor+StyleDictionary.h"
#import "StyleDictionarySize.h"

@interface StyleDictionaryButton : UIButton

@property (nonatomic) float padding;
@property (nonatomic) float borderWidth;
@property (nonatomic) int *backgroundColorBase;
@property (nonatomic) int *backgroundColorActive;
@property (nonatomic) int *fontColorBase;
@property (nonatomic) int *fontColorActive;
@property (nonatomic) int *borderColorBase;
@property (nonatomic) int *borderColorActive;

+ (instancetype) primaryButton;
+ (instancetype) secondaryButton;

@end
