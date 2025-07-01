# Channel Groups API (Objective-C SDK)

Channel Groups bundle multiple channels under one name.  
• Subscribe only (publishing must target individual channels).  
• All operations below require the **Stream Controller** add-on to be enabled for your keys in the Admin Portal.

---

## Add Channels

Adds channels to a channel group.

### Method

```
`- (void)addChannels:(NSArrayNSString *> *)channels   
            toGroup:(NSString *)group   
     withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

Parameters  
• `channels` (NSArray\<NSString *>): Channel names to add.  
• `group` (NSString): Target channel group.  
• `block` (PNChannelGroupChangeCompletionBlock, nullable): Completion status.

### Example

```
`// Initialize PubNub client with your keys  
PNConfiguration *configuration = [PNConfiguration configurationWithPublishKey:@"demo"   
                                                                 subscribeKey:@"demo"  
                                                                       userID:@"testUser"];  
PubNub *client = [PubNub clientWithConfiguration:configuration];  
  
// Define channel group and channels to add  
NSString *channelGroup = @"family";  
NSArray *channels = @[@"wife", @"husband", @"children"];  
  
NSLog(@"Adding channels %@ to channel group: %@", channels, channelGroup);  
  
// Add channels to the channel group  
PNChannelGroupManageRequest *request = [PNChannelGroupManageRequest requestToAddChannels:channels   
                                                                          toChannelGroup:channelGroup];  
`
```
show all 35 lines

### Response

```
`@interface PNAcknowledgmentStatus : PNErrorStatus  
  
@end  
`
```

---

## List Channels

Returns all channels registered in a group.

### Method

```
`- (void)channelsForGroup:(NSString *)group   
          withCompletion:(PNGroupChannelsAuditCompletionBlock)block;  
`
```

Parameters  
• `group` (NSString): Group to audit.  
• `block` (PNGroupChannelsAuditCompletionBlock): `(result, status)`.

### Example

```
`NSString *channelGroup = @"family";  
`
```

```
`[self.client channelsForGroup:channelGroup withCompletion:^(PNChannelGroupChannelsResult *result,  
                                                            PNErrorStatus *status) {  
  
    if (!status) {  
  
        // Handle downloaded list of chanels using: result.data.channels  
    }  
    else {  
  
        /**  
         Handle channels for group audition error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
`
```
show all 19 lines

### Response

```
`@interface PNChannelGroupChannelsData : PNServiceData  
  
// Registered channels within channel group.  
@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
  
@end  
  
@interface PNChannelGroupChannelsResult : PNResult  
  
// Stores reference on channel group's channels list audit request processing information.  
@property (nonatomic, nonnull, readonly, strong) PNChannelGroupChannelsData *data;  
  
@end  
`
```

---

## Remove Channels

Removes specific channels from a group (pass empty array to remove the entire group).

### Method

```
`- (void)removeChannels:(NSArrayNSString *> *)channels   
             fromGroup:(NSString *)group   
        withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

Parameters  
• `channels` (NSArray\<NSString *>): Channels to remove. Empty array = delete group.  
• `group` (NSString): Source group.  
• `block` (PNChannelGroupChangeCompletionBlock, nullable): Completion status.

### Example

```
`NSString *channelGroup = @"family";  
`
```

```
`[self.client removeChannels:@[@"son"] fromGroup:channelGroup  
             withCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
  
        // Handle successful channels list modification for group.  
    }  
    else {  
  
        /**  
         Handle channels list modification for group error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
`
```
show all 19 lines

### Response

```
`@interface PNAcknowledgmentStatus : PNErrorStatus  
  
@end  
`
```

---

## Delete Channel Group

Removes all channels from the specified group (effectively deleting it).

### Method

```
`- (void)removeChannelsFromGroup:(NSString *)group   
                 withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

Parameters  
• `group` (NSString): Group to delete.  
• `block` (PNChannelGroupChangeCompletionBlock, nullable): Completion status.

### Example

```
`NSString *channelGroup = @"family";  
`
```

```
`[self.client removeChannelsFromGroup:channelGroup withCompletion:^(PNAcknowledgmentStatus *status) {  
  
    if (!status.isError) {  
  
        // Handle successful channel group removal.  
    }  
    else {  
  
        /**  
         Handle channel group removal error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
         Request can be resent using: [status retry];  
`
```
show all 18 lines

### Response

```
`@interface PNAcknowledgmentStatus : PNErrorStatus**  
@end  
`
```

_Last updated: May 29, 2025_