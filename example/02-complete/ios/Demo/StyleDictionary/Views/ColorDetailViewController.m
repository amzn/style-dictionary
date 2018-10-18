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
//  ColorDetailViewController.m
//

#import "ColorDetailViewController.h"

@interface ColorDetailViewController ()

@end

@implementation ColorDetailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    CGFloat height = self.view.frame.size.height / 2;
    UIColor *value = [self.property valueForKey:@"value"];
    
    UIView *color = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, height)];
    color.backgroundColor = value;
    [self.view addSubview:color];
    
    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, height, self.view.frame.size.width, height)];
    [self.view addSubview:scrollView];
    
    UIStackView *stackView = [[UIStackView alloc] init];
    [scrollView addSubview:stackView];
    stackView.axis = UILayoutConstraintAxisVertical;
    stackView.distribution = UIStackViewDistributionEqualSpacing;
    stackView.alignment = UIStackViewAlignmentLeading;
    stackView.spacing = StyleDictionarySizePaddingBase;
    stackView.translatesAutoresizingMaskIntoConstraints = false;
    [stackView.topAnchor constraintEqualToAnchor:scrollView.topAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.leftAnchor constraintEqualToAnchor:scrollView.leftAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.rightAnchor constraintEqualToAnchor:scrollView.rightAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.bottomAnchor constraintEqualToAnchor:scrollView.bottomAnchor].active = true;
    [stackView.widthAnchor constraintEqualToConstant:scrollView.frame.size.width - (StyleDictionarySizePaddingBase *2)].active = true;
    
    UILabel *title = [[UILabel alloc] init];
    title.text = self.name;
    title.font = [UIFont systemFontOfSize:StyleDictionarySizeFontLarge weight:UIFontWeightLight];
    if ([[self.property valueForKey:@"type"] isEqualToString:@"font"]) {
        title.textColor = [self.property valueForKey:@"value"];
    }

    [stackView addArrangedSubview:title];
    [title.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;
    
    UILabel *label = [[UILabel alloc] init];
    [stackView addArrangedSubview:label];
    label.autoresizingMask = UIViewAutoresizingFlexibleHeight;
    label.numberOfLines = 0;
    label.preferredMaxLayoutWidth = scrollView.frame.size.width - (StyleDictionarySizePaddingBase *2);
    [label setLineBreakMode:NSLineBreakByCharWrapping];
    [label.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;
    label.text = [self getText];
    label.font = [UIFont systemFontOfSize:StyleDictionarySizeFontSmall weight:UIFontWeightMedium];
    label.textColor = [UIColor styleDictionaryColor:StyleDictionaryColorFontSecondary];
    
    self.view.backgroundColor = [UIColor styleDictionaryColor:StyleDictionaryColorBackgroundBase];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (NSString *) getText {
    NSString *name = [self.property valueForKey:@"name"];
    NSString *import = @"#import <StyleDictionary/StyleDictionary.h>";
    return [NSString stringWithFormat:@"%@\n....\n\n[UIColor styleDictionaryColor:\n%@];",import,name];
}


@end
