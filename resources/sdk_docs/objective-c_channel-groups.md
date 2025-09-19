# Channel Groups API – Objective-C SDK

Channel Groups let you bundle thousands of channels and subscribe to the bundle.  
NOTE: All operations below require the **Stream Controller** add-on to be enabled for your key.

---

## Add Channels

### Method
```objc
- (void)addChannels:(NSArray<NSString *> *)channels
            toGroup:(NSString *)group
     withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;
```

Parameters  
• `channels` NSArray\<NSString *> – channels to add.  
• `group` NSString – target channel group.  
• `block` PNChannelGroupChangeCompletionBlock – completion status.

### Example
```objc
// Initialize PubNub client
PNConfiguration *configuration =
  [PNConfiguration configurationWithPublishKey:@"demo"
                                  subscribeKey:@"demo"
                                        userID:@"testUser"];
PubNub *client = [PubNub clientWithConfiguration:configuration];

NSString *channelGroup = @"family";
NSArray *channels = @[@"wife", @"husband", @"children"];

PNChannelGroupManageRequest *request =
  [PNChannelGroupManageRequest requestToAddChannels:channels
                                     toChannelGroup:channelGroup];
```

### Response
```objc
@interface PNAcknowledgmentStatus : PNErrorStatus
@end
```

---

## List Channels

### Method
```objc
- (void)channelsForGroup:(NSString *)group
          withCompletion:(PNGroupChannelsAuditCompletionBlock)block;
```

Parameters  
• `group` NSString – channel group to audit.  
• `block` PNGroupChannelsAuditCompletionBlock – returns `result` (channels) or `status` (error).

### Example
```objc
NSString *channelGroup = @"family";
```

```objc
[self.client channelsForGroup:channelGroup
                withCompletion:^(PNChannelGroupChannelsResult *result,
                                 PNErrorStatus *status) {

    if (!status) {
        // result.data.channels
    } else {
        // status.category / status.errorData
    }
}];
```

### Response
```objc
@interface PNChannelGroupChannelsData : PNServiceData
@property (nonatomic, readonly, strong) NSArray<NSString *> *channels;
@end

@interface PNChannelGroupChannelsResult : PNResult
@property (nonatomic, nonnull, readonly, strong) PNChannelGroupChannelsData *data;
@end
```

---

## Remove Channels

### Method
```objc
- (void)removeChannels:(NSArray<NSString *> *)channels
             fromGroup:(NSString *)group
        withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;
```

Parameters  
• `channels` NSArray\<NSString *> – channels to remove (empty array deletes the group).  
• `group` NSString – channel group.  
• `block` PNChannelGroupChangeCompletionBlock – completion status.

### Example
```objc
NSString *channelGroup = @"family";

[self.client removeChannels:@[@"son"]
                  fromGroup:channelGroup
             withCompletion:^(PNAcknowledgmentStatus *status) {

    if (!status.isError) {
        // Success
    } else {
        // status.category / status.errorData
    }
}];
```

### Response
```objc
@interface PNAcknowledgmentStatus : PNErrorStatus
@end
```

---

## Delete Channel Group

### Method
```objc
- (void)removeChannelsFromGroup:(NSString *)group
                 withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;
```

Parameters  
• `group` NSString – channel group to delete.  
• `block` PNChannelGroupChangeCompletionBlock – completion status.

### Example
```objc
NSString *channelGroup = @"family";

[self.client removeChannelsFromGroup:channelGroup
                       withCompletion:^(PNAcknowledgmentStatus *status) {

    if (!status.isError) {
        // Group removed
    } else {
        // status.retry, status.category / status.errorData
    }
}];
```

### Response
```objc
@interface PNAcknowledgmentStatus : PNErrorStatus
@end
```

_Last updated: Jul 15 2025_