On this page
# Channel Groups API for Objective-C SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Objective-C SDK:

```
`- (void)addChannels:(NSArrayNSString *> *)channels   
            toGroup:(NSString *)group   
     withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of channel names which should be added to the group.`group` *Type: NSStringName of the group into which channels should be added.`block`Type: PNChannelGroupChangeCompletionBlock`Channels` addition process completion block which pass only one argument - request processing status to report about how data pushing was successful or not.

### Basic Usage[​](#basic-usage)

#### Add Channels[​](#add-channels-1)

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

### Response[​](#response)

Response objects which is returned by client when Add Channels to Group API is used:

```
`@interface PNAcknowledgmentStatus : PNErrorStatus  
  
@end  
`
```

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Objective-C SDK:

```
`- (void)channelsForGroup:(NSString *)group   
          withCompletion:(PNGroupChannelsAuditCompletionBlock)block;  
`
```

*  requiredParameterDescription`group` *Type: NSStringName of the group from which `channels` should be fetched.`block` *Type: PNClientChannelsForGroupRequestHandlingBlock`Channels` audition process completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of channel groups `channels` audition operation; status - in case if error occurred during request processing.

### Basic Usage[​](#basic-usage-1)

#### List Channels[​](#list-channels-1)

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

### Response[​](#response-1)

Response objects which is returned by client when Add Channels to Group API is used:

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

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Objective-C SDK:

```
`- (void)removeChannels:(NSArrayNSString *> *)channels   
             fromGroup:(NSString *)group   
        withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

*  requiredParameterDescription`channels` *Type: NSArrayList of channel names which should be removed from group. `If empty list passed whole channel group will be removed.``group` *Type: NSStringChannel group from which channels should be removed.`block`Type: PNChannelGroupChangeCompletionBlockChannels removal process completion block which pass only one argument - request processing status to report about how data pushing was successful or not.

### Basic Usage[​](#basic-usage-2)

#### Remove channels[​](#remove-channels-1)

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

### Response[​](#response-2)

Response objects which is returned by client when Remove Channels to Group API is used:

```
`@interface PNAcknowledgmentStatus : PNErrorStatus  
  
@end  
`
```

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

`Deleting Channel Group` is accomplished by using the following method(s) in the Objective-C SDK:

```
`- (void)removeChannelsFromGroup:(NSString *)group   
                 withCompletion:(nullable PNChannelGroupChangeCompletionBlock)block;  
`
```

*  requiredParameterDescription`group` *Type: NSStringName of the `group` from which all `channels` should be removed.`block`Type: PNChannelGroupChangeCompletionBlockChannel group removal process completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

### Basic Usage[​](#basic-usage-3)

Deleting Channel Group :

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

### Response[​](#response-3)

Response objects which is returned by client when Remove Channel Group API is used:

```
`@interface PNAcknowledgmentStatus : PNErrorStatus**  
@end  
`
```
Last updated on May 29, 2025**