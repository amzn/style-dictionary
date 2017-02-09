//
//  PrimaryButton.m
//  Pods
//
//  Created by Banks, Daniel on 1/28/17.
//
//

#import "PrimaryButton.h"

@implementation PrimaryButton

/*
// Only override drawRect: if you perform custom drawing.
// An empty implementation adversely affects performance during animation.
- (void)drawRect:(CGRect)rect {
    // Drawing code
}
*/

- (instancetype)init {
    self = [super init];
    
    if (self) {
        [self adjustButtonColor];
        self.titleLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontButtonPrimary];
        self.titleLabel.font = [UIFont systemFontOfSize:StyleDictionarySizeFontLarge];
        UIEdgeInsets contentInsets = UIEdgeInsetsMake(StyleDictionarySizePaddingBase, StyleDictionarySizePaddingBase, StyleDictionarySizePaddingBase, StyleDictionarySizePaddingBase);
        self.contentEdgeInsets = contentInsets;
    }
    
    return self;
}


- (void)setSelected:(BOOL)selected {
    [super setSelected:selected];
    [self adjustButtonColor];
}

- (void)setHighlighted:(BOOL)highlighted {
    [super setHighlighted:highlighted];
    [self adjustButtonColor];
}

- (void)adjustButtonColor {
    if (self.selected || self.highlighted) {
        self.backgroundColor = [UIColor styleDictionaryColor:StyleDictionaryColorBackgroundButtonPrimaryActive];
    } else {
        self.backgroundColor = [UIColor styleDictionaryColor:StyleDictionaryColorBackgroundButtonPrimaryBase];
    }
}

@end
