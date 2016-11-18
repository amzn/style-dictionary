//
//  ViewController.m
//  StyleDictionaryExample
//
//  Created by Boudreau, Dustin on 10/27/16.
//  Copyright © 2016 Amazon. All rights reserved.
//

#import "ViewController.h"
#import "StyleDictionary.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    UIView *selfView = self.view;
    NSArray *colors = [[NSArray alloc] initWithObjects:
                      COLOR_BLUE_0,
                      COLOR_BLUE_1,
                      COLOR_BLUE_2,
                      COLOR_BLUE_3,
                      COLOR_BLUE_4,
                      COLOR_GREY_0,
                      COLOR_GREY_1,
                      COLOR_GREY_2,
                      COLOR_GREY_3,
                      COLOR_GREY_4,
                      COLOR_WHITE,
                      COLOR_ORANGE_0,
                      COLOR_ORANGE_1,
                      COLOR_ORANGE_2,
                      COLOR_ORANGE_3,
                      COLOR_ORANGE_4, nil];
    CGRect window = selfView.frame;
    float colorBoxWidth = window.size.width;
    float colorBoxHeight = window.size.height / colors.count;
    for (int i = 0; i < colors.count; i++) {
        UIView *colorBox = [[UIView alloc] initWithFrame: CGRectMake(0, (float)i * colorBoxHeight, colorBoxWidth, colorBoxHeight)];
        colorBox.backgroundColor = [colors objectAtIndex:i];
        [selfView addSubview:colorBox];
        
    }
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


@end
