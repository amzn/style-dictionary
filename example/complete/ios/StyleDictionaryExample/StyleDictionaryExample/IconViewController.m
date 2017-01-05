//
//  IconViewController.m
//  StyleDictionaryExample
//
//  Created by Banks, Daniel on 1/2/17.
//  Copyright © 2017 Amazon. All rights reserved.
//

#import "IconViewController.h"
#import "StyleDictionary.h"
#import "IconFont.h"
#import "StyleDictionaryMacros.h"

@interface IconViewController ()

@end

@implementation IconViewController

{
    NSArray *tableData;
    NSDictionary *icons;
}


- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    icons = [[StyleDictionary sharedInstance] getProperty:@"content.icon"];
    tableData = [[icons allKeys] sortedArrayUsingSelector:@selector(localizedStandardCompare:)];
    
    // init table view
    UITableView *tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
    
    // must set delegate & dataSource, otherwise the the table will be empty and not responsive
    tableView.delegate = self;
    tableView.dataSource = self;
    
    // add to canvas
    [self.view addSubview:tableView];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [tableData count];
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *tableIdentifier = @"TableItem";
    
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:tableIdentifier];
    
    if (cell == nil) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleValue1 reuseIdentifier:tableIdentifier];
    }
    
    NSString *iconName = [tableData objectAtIndex:indexPath.row];
    NSString *icon = [icons valueForKeyPath:[NSString stringWithFormat:@"%@.value", iconName]];
    
    cell.textLabel.attributedText = [IconFont getIcon:icon withSize:[SIZE_ICON_BASE floatValue] andColor:COLOR_FONT_SECONDARY];
    cell.detailTextLabel.text = iconName;
    cell.detailTextLabel.font = [cell.detailTextLabel.font fontWithSize:[SIZE_FONT_BASE floatValue]];
    return cell;
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
