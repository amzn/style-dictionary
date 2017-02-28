//
//  HeaderCollectionViewCell.m
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 2/9/17.
//  Copyright © 2017 Danny Banks. All rights reserved.
//

#import "HeaderCollectionViewCell.h"

@implementation HeaderCollectionViewCell

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        CGRect frame = CGRectMake(StyleDictionarySizePaddingBase,
                                  StyleDictionarySizePaddingSmall,
                                  self.frame.size.width - (StyleDictionarySizePaddingBase*2),
                                  self.frame.size.height - (StyleDictionarySizePaddingSmall*2));
        
        self.titleLabel = [[UILabel alloc] initWithFrame:frame];
        self.titleLabel.textAlignment = NSTextAlignmentLeft;
        self.titleLabel.font = [UIFont systemFontOfSize:StyleDictionarySizeFontBase];
        self.titleLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontSecondary];
        
        [self.contentView addSubview:self.titleLabel];
    }
    
    return self;
    
}

@end
