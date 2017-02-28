//
//  CardViewCell.h
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 1/30/17.
//  Copyright © 2017 Danny Banks. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <StyleDictionary/StyleDictionary.h>

@interface CardViewCell : UICollectionViewCell

@property (nonatomic, strong) NSString *title;
@property (nonatomic, strong) NSString *subtitle;
@property (nonatomic, strong) NSString *icon;

@property (nonatomic, retain) UILabel *titleLabel;
@property (nonatomic, retain) UILabel *subtitleLabel;
@property (nonatomic, retain) UILabel *iconLabel;

- (void)setTitle:(NSString *)title andSubtitle:(NSString *)subtitle andIcon:(NSString *)icon;

@end
