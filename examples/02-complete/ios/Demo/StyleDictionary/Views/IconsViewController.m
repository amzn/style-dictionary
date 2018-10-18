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
//  IconsViewController.m
//

#import "IconsViewController.h"


@implementation IconsViewController

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    [self.tableView deselectRowAtIndexPath:[self.tableView indexPathForSelectedRow] animated:YES];
}


- (void)viewDidLoad {
    [super viewDidLoad];
    NSSortDescriptor *descriptor = [NSSortDescriptor sortDescriptorWithKey:@"name"
                                                                  ascending:YES
                                                                   selector:@selector(localizedStandardCompare:)];
    self.tableData = [[[[StyleDictionaryProperties properties] valueForKeyPath:@"content.icon"] allValues] sortedArrayUsingDescriptors:@[descriptor]];
    
    // init table view
    self.tableView = [[UITableView alloc] initWithFrame:self.view.bounds style:UITableViewStylePlain];
    self.tableView.rowHeight = 60.0f;
    
    // must set delegate & dataSource, otherwise the the table will be empty and not responsive
    self.tableView.delegate = self;
    self.tableView.dataSource = self;
    
    [self.navigationItem setTitle:@"Icons"];
}


- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [self.tableData count];
}


- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *tableIdentifier = @"TableItem";
    
    IconViewCell *cell = [tableView dequeueReusableCellWithIdentifier:tableIdentifier];
    
    if (cell == nil) {
        cell = [[IconViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:tableIdentifier];
    }
    
    cell.valueLabel.text = [[self.tableData objectAtIndex:indexPath.row]  valueForKey:@"value"];
    cell.keyLabel.text = [[self.tableData objectAtIndex:indexPath.row]  valueForKey:@"item"];
    
    return cell;
}


- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
    IconDetailViewController *controller = [[IconDetailViewController alloc] init];
    
    controller.property = [self.tableData objectAtIndex:indexPath.row];
    [self.navigationController pushViewController:controller animated:true];
}

@end
