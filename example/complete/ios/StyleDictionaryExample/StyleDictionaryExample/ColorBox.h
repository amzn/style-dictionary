//
//  ColorBox.h
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 1/1/17.
//  Copyright © 2017 Amazon. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ColorBox : UIView
@property(nonatomic, strong) UILabel *keyLabel;
@property(nonatomic, strong) UILabel *valueLabel;

- (id) initWithProps:(NSDictionary *)props andKey:(NSString *)key;

@end
