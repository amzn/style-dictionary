//
//  IconFont.h
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 1/3/17.
//  Copyright © 2017 Amazon. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface IconFont : NSObject

+ (NSAttributedString *)getIcon:(NSString *)icon
                       withSize:(CGFloat)size
                       andColor:(UIColor *)color;

@end
