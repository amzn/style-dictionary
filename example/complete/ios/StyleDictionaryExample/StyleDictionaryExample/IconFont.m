//
//  IconFont.m
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 1/3/17.
//  Copyright © 2017 Amazon. All rights reserved.
//

#import "IconFont.h"

@implementation IconFont

+ (NSAttributedString *)getIcon:(NSString *)icon
                       withSize:(CGFloat)size
                       andColor:(UIColor *)color {
    if (!icon) {
        return nil;
    }
    
    UIFont *iconFont = [UIFont fontWithName:@"MaterialIcons-Regular"
                                       size:size];
    
    NSDictionary *iconFontAttributes = @{
                                         NSFontAttributeName: iconFont,
                                         NSForegroundColorAttributeName: color
                                         };
    
    return [[NSAttributedString alloc] initWithString:icon
                                           attributes:iconFontAttributes];
}

@end
