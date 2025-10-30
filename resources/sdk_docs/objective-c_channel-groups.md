# Channel Groups API for Objective-C SDK

Channel groups let you subscribe to many channels via a single group name. You can't publish to a channel group; publish to individual channels instead.

##### Channel group operations
- Subscribe to channel groups; publishing directly to a group isn't supported.

## Add channels to a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See support page for enabling add-ons.

Adds channels to a channel group.

### Method(s)

```
`1- (void)addChannels:(NSArrayNSString *> *)channels   
2            toGroup:(NSString *)group   
3     withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

Parameters:
- channels (Type: NSArray): List of channel names to add.
- group (Type: NSString): Group name to add channels to.
- block (Type: PNChannelGroupChangeCompletionBlock): Completion block with request status.

### Sample code

#### Add channels

```
1// Initialize PubNub client with your keys  
2PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"   
3                                                                 subscribeKey:@"demo"  
4                                                                       userID:@"testUser"];  
5PubNub *client = [PubNub clientWithConfiguration:configuration];  
6
  
7// Define channel group and channels to add  
8NSString *channelGroup = @"family";  
9NSArray *channels = @[@"wife", @"husband", @"children"];  
10
  
11NSLog(@"Adding channels %@ to channel group: %@", channels, channelGroup);  
12
  
13// Add channels to the channel group  
14PNChannelGroupManageRequest *request = [PNChannelGroupManageRequest requestToAddChannels:channels   
15                                                                          toChannelGroup:channelGroup];  
16
  
17[client manageChannelGroupWithRequest:request completion:^(PNAcknowledgmentStatus *status) {  
18    if (!status.isError) {  
19        NSLog(@"Channels successfully added to channel group!");  
20          
21        // Verify by listing channels in the group  
22        PNChannelGroupFetchRequest *request = [PNChannelGroupFetchRequest requestWithChannelGroup:channelGroup];  
23        [client fetchChannelsForChannelGroupWithRequest:request  
24            completion:^(PNChannelGroupChannelsResult *result, PNErrorStatus *status) {  
25            if (!status.isError) {  
26                NSLog(@"Channels in group '%@': %@", channelGroup, result.data.channels);  
27            } else {  
28                NSLog(@"Error listing channels in group: %@", status.errorData.information);  
29            }  
30        }];  
31    } else {  
32        NSLog(@"Error adding channels to group: %@", status.errorData.information);  
33        NSLog(@"Error category: %@", @(status.category));  
34    }  
35}];  
```

### Response

```
1@interface PNAcknowledgmentStatus : PNErrorStatus  
2
  
3@end  
```

## List channels in a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See support page for enabling add-ons.

Lists channels in a channel group.

### Method(s)

```
`1- (void)channelsForGroup:(NSString *)group   
2          withCompletion:(PNGroupChannelsAuditCompletionBlock)block;  
`
```

Parameters:
- group (Type: NSString): Group name to fetch channels from.
- block (Type: PNClientChannelsForGroupRequestHandlingBlock): Completion block with result (channels) or status (error).

### Sample code

#### List channels

```
`1NSString *channelGroup = @"family";  
`
```

```
1[self.client channelsForGroup:channelGroup withCompletion:^(PNChannelGroupChannelsResult *result,  
2                                                            PNErrorStatus *status) {  
3
  
4    if (!status) {  
5
  
6        // Handle downloaded list of chanels using: result.data.channels  
7    }  
8    else {  
9
  
10        /**  
11         Handle channels for group audition error. Check 'category' property  
12         to find out possible reason because of which request did fail.  
13         Review 'errorData' property (which has PNErrorData data type) of status  
14         object to get additional information about issue.  
15  
16         Request can be resent using: [status retry];  
17         */  
18    }  
19}];  
```

### Response

```
1@interface PNChannelGroupChannelsData : PNServiceData  
2
  
3// Registered channels within channel group.  
4@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
5
  
6@end  
7
  
8@interface PNChannelGroupChannelsResult : PNResult  
9
  
10// Stores reference on channel group's channels list audit request processing information.  
11@property (nonatomic, nonnull, readonly, strong) PNChannelGroupChannelsData *data;  
12
  
13@end  
```

## Remove channels from a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See support page for enabling add-ons.

Removes channels from a channel group.

### Method(s)

```
`1- (void)removeChannels:(NSArrayNSString *> *)channels   
2             fromGroup:(NSString *)group   
3        withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

Parameters:
- channels (Type: NSArray): Channels to remove. If empty list is passed, the whole channel group will be removed.
- group (Type: NSString): Group to remove channels from.
- block (Type: PNChannelGroupChangeCompletionBlock): Completion block with request status.

### Sample code

#### Remove channels

```
`1NSString *channelGroup = @"family";  
`
```

```
1[self.client removeChannels:@[@"son"] fromGroup:channelGroup  
2             withCompletion:^(PNAcknowledgmentStatus *status) {  
3
  
4    if (!status.isError) {  
5
  
6        // Handle successful channels list modification for group.  
7    }  
8    else {  
9
  
10        /**  
11         Handle channels list modification for group error. Check 'category' property  
12         to find out possible reason because of which request did fail.  
13         Review 'errorData' property (which has PNErrorData data type) of status  
14         object to get additional information about issue.  
15  
16         Request can be resent using: [status retry];  
17         */  
18    }  
19}];  
```

### Response

```
1@interface PNAcknowledgmentStatus : PNErrorStatus  
2
  
3@end  
```

## Delete a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See support page for enabling add-ons.

Deletes a channel group.

### Method(s)

```
`1- (void)removeChannelsFromGroup:(NSString *)group   
2                 withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

Parameters:
- group (Type: NSString): Group from which all channels will be removed.
- block (Type: PNChannelGroupChangeCompletionBlock): Completion block with request status.

### Sample code

Deleting Channel Group:

```
`1NSString *channelGroup = @"family";  
`
```

```
1[self.client removeChannelsFromGroup:channelGroup withCompletion:^(PNAcknowledgmentStatus *status) {  
2
  
3    if (!status.isError) {  
4
  
5        // Handle successful channel group removal.  
6    }  
7    else {  
8
  
9        /**  
10         Handle channel group removal error. Check 'category' property  
11         to find out possible reason because of which request did fail.  
12         Review 'errorData' property (which has PNErrorData data type) of status  
13         object to get additional information about issue.  
14  
15         Request can be resent using: [status retry];  
16         */  
17    }  
18}];  
```

### Response

```
1@interface PNAcknowledgmentStatus : PNErrorStatus  
2
**3@end  
```

Last updated on Sep 3, 2025**