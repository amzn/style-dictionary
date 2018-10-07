//
// Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.
// A copy of the License is located at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// or in the "license" file accompanying this file. This file is distributed
// on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.
//
//  IconViewCell.m
//

#import "IconViewCell.h"

@implementation IconViewCell

- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
    self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
    if (self) {
        CGRect frame = CGRectMake(StyleDictionarySizePaddingBase, StyleDictionarySizePaddingSmall, self.contentView.frame.size.width - (StyleDictionarySizePaddingBase * 2), self.contentView.frame.size.height);

        self.keyLabel = [[UILabel alloc] initWithFrame:frame];
        self.keyLabel.textAlignment = NSTextAlignmentLeft;
        self.keyLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontBase];
        self.valueLabel = [[UILabel alloc] initWithFrame:frame];
        self.valueLabel.textAlignment = NSTextAlignmentRight;
        self.valueLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontTertiary];
        self.valueLabel.font = [UIFont iconFontOfSize:StyleDictionarySizeIconBase];
        
        [self.contentView addSubview:self.keyLabel];
        [self.contentView addSubview:self.valueLabel];
        
        UIView *customColorView = [[UIView alloc] init];
        customColorView.backgroundColor = [UIColor styleDictionaryColor:StyleDictionaryColorBackgroundButtonPrimaryActive];
        self.selectedBackgroundView = customColorView;
    }
    return self;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];
    if (selected) {
        self.keyLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontInverseBase];
        self.valueLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontInverseBase];
    } else {
        self.keyLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontBase];
        self.valueLabel.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontBase];
    }
    
}



@end
