//
//  ColorBox.m
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 1/1/17.
//  Copyright © 2017 Amazon. All rights reserved.
//

#import "ColorBox.h"
#import "StyleDictionaryMacros.h"
#import "StyleDictionary.h"

@implementation ColorBox

// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
    float padding = [SIZE_PADDING_BASE floatValue];
    CGRect frame = CGRectMake(padding, padding, self.frame.size.width - (padding*2), self.frame.size.height - (padding*2));
    
    self.keyLabel.frame = frame;
    self.keyLabel.textAlignment = NSTextAlignmentLeft;
    self.valueLabel.frame = frame;
    self.valueLabel.textAlignment = NSTextAlignmentRight;
}


- (id) initWithProps:(NSDictionary *)props andKey:(NSString *)key {
    self = [super init];
    
    if (self) {
        _keyLabel = [[UILabel alloc] init];
        _keyLabel.text = key;
        _valueLabel = [[UILabel alloc] init];
        
        CGFloat red = 0.0, green = 0.0, blue = 0.0, alpha = 0.0;
        [[props valueForKey:@"value"] getRed:&red green:&green blue:&blue alpha:&alpha];
        
        _valueLabel.text = [NSString stringWithFormat:@"%.f, %.f, %.f", red*255, green*255, blue*255];
        
        if ([[props valueForKey:@"font"] isEqualToString:@"inverse"]) {
            _keyLabel.textColor = COLOR_FONT_INVERSE_BASE;
            _valueLabel.textColor = COLOR_FONT_INVERSE_BASE;
        }
        
        self.backgroundColor = [props valueForKey:@"value"];
        [self addSubview:_keyLabel];
        [self addSubview:_valueLabel];
    }
    
    return self;
}



@end
