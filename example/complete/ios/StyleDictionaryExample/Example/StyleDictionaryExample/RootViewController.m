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

@interface RootViewController ()

@end

@implementation RootViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, self.view.frame.size.height)];
    [self.view addSubview:scrollView];
    
    UIStackView *stackView = [[UIStackView alloc] init];
    stackView.axis = UILayoutConstraintAxisVertical;
    stackView.distribution = UIStackViewDistributionEqualSpacing;
    stackView.alignment = UIStackViewAlignmentLeading;
    stackView.spacing = StyleDictionarySizePaddingLarge;

    StyleDictionaryButton *button = [StyleDictionaryButton primaryButton];
    [button setTitle:@"ICONS" forState:UIControlStateNormal];
    [button addTarget:self action:@selector(buttonAction) forControlEvents:UIControlEventTouchUpInside];
    [stackView addArrangedSubview:button];
    [button.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;

    StyleDictionaryButton *colorButton = [StyleDictionaryButton primaryButton];
    [colorButton setTitle:@"COLORS" forState:UIControlStateNormal];
    [colorButton addTarget:self action:@selector(colorButtonAction:) forControlEvents:UIControlEventTouchUpInside];
    [stackView addArrangedSubview:colorButton];
    [colorButton.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;
    
    PrimaryButton *sizeButton = [[PrimaryButton alloc] init];
    [sizeButton setTitle:@"SIZES" forState:UIControlStateNormal];
    [sizeButton addTarget:self action:@selector(sizeButtonAction:) forControlEvents:UIControlEventTouchUpInside];
    [stackView addArrangedSubview:sizeButton];
    [sizeButton.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;
    
    PrimaryButton *propertyButton = [[PrimaryButton alloc] init];
    [propertyButton setTitle:@"ALL PROPERTIES" forState:UIControlStateNormal];
    [propertyButton addTarget:self action:@selector(propertyButtonAction:) forControlEvents:UIControlEventTouchUpInside];
    [stackView addArrangedSubview:propertyButton];
    [propertyButton.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = YES;
    
    stackView.translatesAutoresizingMaskIntoConstraints = false;
    [scrollView addSubview:stackView];
    [stackView.topAnchor constraintEqualToAnchor:scrollView.topAnchor].active = true;
    [stackView.leftAnchor constraintEqualToAnchor:scrollView.leftAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.rightAnchor constraintEqualToAnchor:scrollView.rightAnchor constant:StyleDictionarySizePaddingBase].active = true;
    [stackView.bottomAnchor constraintEqualToAnchor:scrollView.bottomAnchor].active = true;
    [stackView.widthAnchor constraintEqualToConstant:scrollView.frame.size.width - (StyleDictionarySizePaddingBase *2)].active = true;
    
    [self.navigationItem setTitle:@"Style Dictionary Example"];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void)buttonAction {
    IconsViewController *nextController = [[IconsViewController alloc] init];
    [[self navigationController] pushViewController:nextController animated:YES];
}

- (void)colorButtonAction:(id)sender {
    ColorViewController *nextController = [[ColorViewController alloc] init];
    [[self navigationController] pushViewController:nextController animated:YES];
}


- (void)sizeButtonAction:(id)sender {
    SizeViewController *nextController = [[SizeViewController alloc] init];
    [[self navigationController] pushViewController:nextController animated:YES];
}

- (void)propertyButtonAction:(id)sender {
    PropertiesViewController *nextController = [[PropertiesViewController alloc] init];
    nextController.properties = [StyleDictionaryProperties properties];
    nextController.name = @"Properties";
    [[self navigationController] pushViewController:nextController animated:YES];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
