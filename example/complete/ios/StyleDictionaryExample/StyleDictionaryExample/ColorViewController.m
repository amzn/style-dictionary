//
//  ColorViewController.m
//  StyleDictionaryExample
//
//  Created by Boudreau, Dustin on 10/27/16.
//  Copyright © 2016 Amazon. All rights reserved.
//

#import "ColorViewController.h"
#import "StyleDictionary.h"
#import "StyleDictionaryMacros.h"
#import "ColorBox.h"

@interface ColorViewController ()

@end

@implementation ColorViewController

- (void)viewDidLoad {
    [super viewDidLoad];

    UINavigationBar *newNavBar = [[UINavigationBar alloc] initWithFrame:CGRectMake(0, 0, CGRectGetWidth(self.view.bounds), 64.0)];

    // 3. add a new navigation item w/title to the new nav bar
    UINavigationItem *newItem = [[UINavigationItem alloc] init];
    newItem.title = @"Paths";
    [newNavBar setItems:@[newItem]];

    // 4. add the nav bar to the main view
    [self.view addSubview:newNavBar];

    UIView *selfView = self.view;

    float padding = [SIZE_PADDING_BASE floatValue];

    UIScrollView *scrollView = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, selfView.frame.size.width, selfView.frame.size.height)];
    [selfView addSubview:scrollView];

    UIStackView *stackView = [[UIStackView alloc] init];
    stackView.axis = UILayoutConstraintAxisVertical;
    stackView.distribution = UIStackViewDistributionEqualSpacing;
    stackView.alignment = UIStackViewAlignmentLeading;
    stackView.spacing = 50;

    NSDictionary *sd = [[[StyleDictionary sharedInstance] properties] valueForKeyPath:@"color.base"];
    NSArray *colorGroups = [sd allKeys];

    for (int i = 0; i < colorGroups.count; i++) {
        if (![colorGroups[i] isEqualToString: @"white"] && ![colorGroups[i] isEqualToString:@"black"]) {
            NSArray *colors = [[sd valueForKey:colorGroups[i]] allKeys];
            NSArray *sortedColors = [colors sortedArrayUsingSelector:@selector(localizedStandardCompare:)];
            UIStackView *colorGroup = [[UIStackView alloc] init];
            colorGroup.axis = UILayoutConstraintAxisVertical;
            colorGroup.distribution = UIStackViewDistributionEqualSpacing;
            colorGroup.alignment = UIStackViewAlignmentLeading;
            colorGroup.spacing = 0;
            [stackView addArrangedSubview:colorGroup];

            ColorBox *colorGroupHeader = [[ColorBox alloc] initWithProps:[sd valueForKeyPath:[NSString stringWithFormat:@"%@.500", colorGroups[i]]]
                                          andKey:colorGroups[i]];
            [colorGroup addArrangedSubview:colorGroupHeader];
            [colorGroupHeader.heightAnchor constraintEqualToConstant:100.0f].active = true;
            [colorGroupHeader.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = true;

            for (int j = 0; j < colors.count; j++) {
                NSString *colorKey = [sortedColors objectAtIndex:j];
                NSDictionary *color = [sd valueForKeyPath:[NSString stringWithFormat:@"%@.%@", colorGroups[i], colorKey]];
                ColorBox *colorBox = [[ColorBox alloc] initWithProps:color andKey:colorKey];
                [colorGroup addArrangedSubview:colorBox];
                [colorBox.heightAnchor constraintEqualToConstant:50.0f].active = true;
                [colorBox.widthAnchor constraintEqualToAnchor:stackView.widthAnchor].active = true;
            }
        }
    }

    stackView.translatesAutoresizingMaskIntoConstraints = false;
    [scrollView addSubview:stackView];

    // Pin the edges of the stack view to the edges of the scroll view that contains it
    [stackView.topAnchor constraintEqualToAnchor:scrollView.topAnchor].active = true;
    [stackView.leftAnchor constraintEqualToAnchor:scrollView.leftAnchor constant:padding].active = true;
    [stackView.rightAnchor constraintEqualToAnchor:scrollView.rightAnchor constant:padding].active = true;
    [stackView.bottomAnchor constraintEqualToAnchor:scrollView.bottomAnchor].active = true;
    [stackView.widthAnchor constraintEqualToConstant:scrollView.frame.size.width - (padding *2)].active = true;
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
