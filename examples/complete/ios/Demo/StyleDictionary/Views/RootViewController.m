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
//  RootViewController.m
//

#import "RootViewController.h"

@implementation RootViewController

{
    NSArray *array;
    NSArray *titles;
}

- (void)viewDidLoad {
    [super viewDidLoad];
    [self.navigationItem setTitle:@"Style Dictionary Example"];
    array = @[[ColorViewController class], [IconsViewController class], [SizeViewController class], [PropertiesViewController class]];
    titles = @[@"Colors", @"Icons", @"Sizes", @"All Properties"];
    
    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
    [self.view addSubview:scrollView];
    
    UIStackView *stackView = [[UIStackView alloc] init];
    stackView.axis = UILayoutConstraintAxisVertical;
    stackView.distribution = UIStackViewDistributionEqualSpacing;
    stackView.alignment = UIStackViewAlignmentLeading;
    stackView.spacing = StyleDictionarySizePaddingLarge;
    
    stackView.translatesAutoresizingMaskIntoConstraints = false;
    [scrollView addSubview:stackView];
    [stackView.topAnchor constraintEqualToAnchor:scrollView.topAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.leftAnchor constraintEqualToAnchor:scrollView.leftAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.rightAnchor constraintEqualToAnchor:scrollView.rightAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.bottomAnchor constraintEqualToAnchor:scrollView.bottomAnchor].active = true;
    [stackView.widthAnchor constraintEqualToConstant:scrollView.frame.size.width - (StyleDictionarySizePaddingBase *2)].active = true;
    
    for (int i = 0; i < [titles count]; i++) {
        StyleDictionaryButton *button = [StyleDictionaryButton primaryButton];
        [button setTitle:titles[i] forState:UIControlStateNormal];
        [button addTarget:self action:@selector(linkAction:) forControlEvents:UIControlEventTouchUpInside];
        [stackView addArrangedSubview:button];
        [button.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;
    }
}


- (void)linkAction:(StyleDictionaryButton *)sender {
    NSUInteger index = [titles indexOfObject:sender.titleLabel.text];
    Class nextClass = array[index];
    UIViewController *nextController = [[nextClass alloc] init];
    if ([nextController isKindOfClass:[PropertiesViewController class]]) {
        ((PropertiesViewController *)nextController).properties = [StyleDictionaryProperties properties];
        ((PropertiesViewController *)nextController).name = @"All Properties";
    }
    [[self navigationController] pushViewController:nextController animated:YES];
}

@end
