On this page
# Presence API for Objective-C SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count of the channel by calling the `hereNowForChannel` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `Here Now` you can use the following method(s) in the Objective-C SDK:

```
`- (void)hereNowForChannel:(NSString *)channel   
           withCompletion:(PNHereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`channel` *Type: NSStringReference on `channel` for which here now information should be received.`block` *Type: PNHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing \c data field will contain results of here now operation; \c status - in case if error occurred during request processing.

```
`- (void)hereNowForChannel:(NSString *)channel  
            withVerbosity:(PNHereNowVerbosityLevel)level  
               completion:(PNHereNowCompletionBlock)block;  
  
`
```

*  requiredParameterDescription`channel` *Type: NSStringReference on `channel` for which here now information should be received.`level` *Type: PNHereNowVerbosityLevelReference on one of PNHereNowVerbosityLevel fields to instruct what exactly data it expected in response.`block` *Type: PNHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing \c data field will contain results of here now operation; \c status - in case if error occurred during request processing.

### Basic Usage[​](#basic-usage)

#### Get a list of uuids subscribed to channel[​](#get-a-list-of-uuids-subscribed-to-channel)

```
`#import Foundation/Foundation.h>  
#import PubNub/PubNub.h>  
  
  
// Basic configuration  
PNConfiguration *config = [PNConfiguration configurationWithPublishKey:@"demo"  
                                                         subscribeKey:@"demo"  
                                                               userID:@"hereNowUser"];  
  
// Create a PubNub client instance  
PubNub *client = [PubNub clientWithConfiguration:config];  
  
// Add listener for PubNub events  
[client addListener:self];  
  
`
```
show all 123 lines

### Response[​](#response)

Response objects which is returned by client when Here Now API for channel used:

```
`@interface PNPresenceGlobalHereNowData : PNServiceData  
  
// Active channels list.  
@property (nonatomic, readonly, strong) NSDictionary$lt;NSString *, NSDictionary *> *channels;  
// Total number of active channels.  
@property (nonatomic, readonly, strong) NSNumber *totalChannels;  
// Total number of subscribers.  
@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;  
  
@end  
  
@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData  
  
@end  
  
`
```
show all 21 lines

### Other Examples[​](#other-examples)

#### Returning State[​](#returning-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

```
`/**  
    With PNHereNowState client aside from occupancy and unique identifiers will will pull out  
    state information associated with them.  
    */  
[self.client hereNowForChannel: @"my_channel" withVerbosity:PNHereNowState  
                    completion:^(PNPresenceChannelHereNowResult *result,  
                                    PNErrorStatus *status) {  
  
    if (!status) {  
  
        /**  
            Handle downloaded presence information using:  
            result.data.uuids - list of uuids. Each uuid entry will have next  
                                fields: "uuid" - identifier and "state" if it  
                                has been provided.  
`
```
show all 30 lines

##### Example Response[​](#example-response)

```
`{  
    "status" : 200,  
    "message" : "OK",  
    "service" : "Presence",  
    "uuids" : [  
        {  
            "uuid" : "myUUID0"  
        },  
        {  
            "state" : {  
                "abcd" : {  
                    "age" : 15  
                }  
            },  
            "uuid" : "myUUID1"  
`
```
show all 38 lines

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `UUIDs` to false:

```
`// With PNHereNowOccupancy client will pull out only occupancy information.  
[self.client hereNowForChannel: @"my_channel" withVerbosity:PNHereNowOccupancy  
                    completion:^(PNPresenceChannelHereNowResult *result,  
                                    PNErrorStatus *status) {  
    if (!status) {  
  
        /**  
            Handle downloaded presence information using:  
            result.data.occupancy - total number of active subscribers.  
            */  
    }  
    else {  
  
        /**  
            Handle presence audit error. Check 'category' property  
`
```
show all 23 lines

##### Example Response[​](#example-response-1)

```
`{  
    "status": 200,  
    "message": "OK",  
    "payload": {  
        "channels": {  
            "81d8d989-b95f-443c-a726-04fac323b331": {  
                "uuids": [ "70fc1140-22b5-4abc-85b2-ff8c17b24d59" ],  
                "occupancy": 1  
            },  
            "81b7a746-d153-49e2-ab70-3037a75cec7e": {  
                "uuids": [ "91363e7f-584b-49cc-822c-52c2c01e5928" ],  
                "occupancy": 1  
            },  
            "c068d15e-772a-4bcd-aa27-f920b7a4eaa8": {  
                "uuids": [ "ccfac1dd-b3a5-4afd-9fd9-db11aeb65395" ],  
`
```
show all 23 lines

## Here Now for Channel Groups[​](#here-now-for-channel-groups)

Request information about subscribers on specific channel group. This API method will retrieve the list of UUIDs along with their state for each remote data object and the number of subscribers.

### Method(s)[​](#methods-1)

To do `Here Now for Channel Groups` you can use the following method(s) in the Objective-C SDK:

```
`- (void)hereNowForChannelGroup:(NSString *)group   
                withCompletion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`group` *Type: NSStringReference on `channel` `group` for which here now information should be received.`block` *Type: PNChannelGroupHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of here now operation; status - in case if `error` occurred during request processing.

```
`- (void)hereNowForChannelGroup:(NSString *)group   
                 withVerbosity:(PNHereNowVerbosityLevel)level   
                    completion:(PNChannelGroupHereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`group` *Type: NSStringReference on `channel` `group` for which here now information should be received.`level` *Type: PNHereNowVerbosityLevelReference on one of `PNHereNowVerbosityLevel` fields to instruct what exactly data it expected in response.`block` *Type: PNChannelGroupHereNowCompletionBlockHere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of here now operation; status - in case if `error` occurred during request processing.

### Basic Usage[​](#basic-usage-1)

#### Here Now for Channel Groups[​](#here-now-for-channel-groups-1)

```
`[self.client hereNowForChannelGroup:@"my_group"  
                      withCompletion:^(PNPresenceChannelGroupHereNowResult *result,  
                                       PNErrorStatus *status) {  
  
    if (!status) {  
  
        /**  
         Handle downloaded presence information using:  
            result.data.channels - dictionary with active channels and presence information on  
                                   each. Each channel will have next fields: "uuids" - list of  
                                   subscribers; occupancy - number of active subscribers.  
                                   Each uuids entry has next fields: "uuid" - identifier and  
                                   "state" if it has been provided.  
            result.data.totalChannels - total number of active channels.  
            result.data.totalOccupancy - total number of active subscribers.  
`
```
show all 29 lines

### Response[​](#response-1)

Response objects which is returned by client when Here Now API for channel group used:

```
`@interface PNPresenceGlobalHereNowData : PNServiceData  
  
// Active channels list.  
@property (nonatomic, readonly, strong) NSDictionary$lt;NSString *, NSDictionary *> *channels;  
// Total number of active channels.  
@property (nonatomic, readonly, strong) NSNumber *totalChannels;  
// Total number of subscribers.  
@property (nonatomic, readonly, strong) NSNumber *totalOccupancy;  
  
@end  
  
@interface PNPresenceChannelGroupHereNowData : PNPresenceGlobalHereNowData  
  
@end  
  
`
```
show all 21 lines

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a UUID is subscribed to by calling the `whereNowUUID` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-2)

To call `whereNowUUID` you can use the following method(s) in the Objective-C SDK:

```
`- (void)whereNowUUID:(NSString *)uuid   
      withCompletion:(PNWhereNowCompletionBlock)block;  
`
```

*  requiredParameterDescription`uuid` *Type: NSStringReference on `UUID` for which request should be performed.`block` *Type: PNWhereNowCompletionBlockWhere now processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of where now operation; status - in case if error occurred during request processing.

### Basic Usage[​](#basic-usage-2)

You simply need to define the `uuid` and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a UUID is subscribed to[​](#get-a-list-of-channels-a-uuid-is-subscribed-to)

```
`[self.client whereNowUUID:self.client.uuid withCompletion:^(PNPresenceWhereNowResult *result,  
                                                            PNErrorStatus *status) {  
  
    if (!status) {  
  
        // Handle downloaded presence 'where now' information using: result.data.channels  
    }  
    else {  
  
        /**  
         Handle presence audit error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
`
```
show all 19 lines

### Response[​](#response-2)

Response objects which is returned by client when Where Now API is used:

```
`@interface PNPresenceWhereNowData : PNServiceData  
  
// List of channels on which client subscribed.  
@property (nonatomic, readonly, strong) NSArrayNSString *> *channels;  
  
@end  
  
@interface PNPresenceWhereNowResult : PNResult  
  
// Stores reference on client presence request processing information.  
@property (nonatomic, readonly, strong) PNPresenceWhereNowData *data;  
  
@end  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

Clients can set a dynamic custom state (score, game state, location) for their users on one or more channels and store it on a channel as long as the user stays subscribed.

The state is not persisted, and when the client disconnects, the state data is lost. For more information, refer to [Presence State](/docs/general/presence/presence-state).

### Method(s)[​](#methods-3)

#### Set State[​](#set-state)

```
`- (void)setState:(nullable NSDictionaryNSString *, id> *)state   
         forUUID:(NSString *)uuid   
       onChannel:(NSString *)channel   
  withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`state`Type: NSDictionaryReference on dictionary which should be bound to `uuid` on specified channel.`If value is nil, state will be removed for` uuid `on` channel.`uuid` *Type: NSStringReference on unique user identifier for which `state` should be bound.`channel` *Type: NSStringName of the `channel` which will store provided state information for `uuid`.`block`Type: PNSetStateCompletionBlockState modification for user on `channel` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

```
`- (void)setState:(nullable NSDictionaryNSString *, id> *)state   
           forUUID:(NSString *)uuid  
    onChannelGroup:(NSString *)group  
    withCompletion:(nullable PNSetStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`state`Type: NSDictionaryReference on dictionary which should be bound to `uuid` on specified channel group.`If value is nil, state will be removed for` uuid `on` group.`uuid` *Type: NSStringReference on unique user identifier for which `state` should be bound.`group` *Type: NSStringName of channel group which will store provided state information for `uuid`.`block`Type: PNSetStateCompletionBlockState modification for user on `channel` processing completion `block` which pass only one argument - request processing status to report about how data pushing was successful or not.

#### Get State[​](#get-state)

```
`- (void)stateForUUID:(NSString *)uuid  
           onChannel:(NSString *)channel  
      withCompletion:(PNChannelStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`uuid` *Type: NSStringReference on unique user identifier for which state should be retrieved.`channel` *Type: NSStringName of channel from which state information for `uuid` will be pulled out.`block` *Type: PNChannelStateCompletionBlockState audition for user on `cahnnel` processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of client state retrieve operation; status - in case if `error` occurred during request processing.

```
`- (void)stateForUUID:(NSString *)uuid  
      onChannelGroup:(NSString *)group  
      withCompletion:(PNChannelGroupStateCompletionBlock)block;  
`
```

*  requiredParameterDescription`uuid` *Type: NSStringReference on unique user identifier for which state should be retrieved.`group` *Type: NSStringName of `channel` `group` from which state information for `uuid` will be pulled out.`block` *Type: PNChannelGroupStateCompletionBlockState audition for user on `cahnnel` `group` processing completion `block` which pass two arguments: result - in case of successful request processing data field will contain results of client state retrieve operation; status - in case if error occurred during request processing.

### Basic Usage[​](#basic-usage-3)

#### Set State[​](#set-state-1)

```
`[self.client setState: @{@"Key": @"Value"} forUUID:self.client.uuid onChannel: @"my_channel"  
       withCompletion:^(PNClientStateUpdateStatus *status) {  
  
    if (!status.isError) {  
  
        // Client state successfully modified on specified channel.  
    }  
    else {  
  
        /**  
         Handle client state modification error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
`
```
show all 19 lines

#### Get State[​](#get-state-1)

```
`[self.client stateForUUID:self.client.uuid onChannel:@"chat"  
            withCompletion:^(PNChannelClientStateResult *result, PNErrorStatus *status) {  
  
    if (!status) {  
  
        // Handle downloaded state information using: result.data.state  
    }  
    else{  
  
        /**  
         Handle client state audit error. Check 'category' property  
         to find out possible reason because of which request did fail.  
         Review 'errorData' property (which has PNErrorData data type) of status  
         object to get additional information about issue.  
  
`
```
show all 19 lines

### Response[​](#response-3)

#### Set State[​](#set-state-2)

Response objects which is returned by client when Set State API for channels used:

```
`@interface PNClientStateUpdateData : PNChannelClientStateData  
  
@end  
  
@interface PNClientStateUpdateStatus : PNErrorStatus  
  
// Stores reference on client state for channel request processing information.  
@property (nonatomic, nonnull, readonly, strong) PNClientStateUpdateData *data;  
  
@end  
`
```

#### Get State[​](#get-state-2)

Response objects which is returned by client when Get State API for channel used:

```
`@interface PNChannelClientStateData : PNServiceData  
  
// User-provided client state information.  
@property (nonatomic, readonly, strong) NSDictionaryNSString *, id> *state;  
  
@end  
  
@interface PNChannelClientStateResult : PNResult  
  
// Stores reference on client state for channel request processing information.  
@property (nonatomic, readonly, strong) PNChannelClientStateData *data;  
  
@end  
`
```

Response objects which is returned by client when Get State API for channel group used:

```
`@interface PNChannelGroupClientStateData : PNServiceData  
  
// Multi channel client state information.  
@property (nonatomic, readonly, strong) NSDictionaryNSString *, NSDictionary *> *channels;  
  
@end  
  
@interface PNChannelGroupClientStateResult : PNResult  
  
// Stores reference on client state for channel group request processing information.  
@property (nonatomic, readonly, strong) PNChannelGroupClientStateData *data;  
  
@end  
`
```

## User State (Builder Pattern)[​](#user-state-builder-pattern)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

The state API is used to set/get key/value pairs specific to a subscriber `uuid`.

State information is supplied as a JSON object of key/value pairs.

### Method(s)[​](#methods-4)

#### Set State[​](#set-state-3)

```
`state()  
    .set()  
    .uuid(NSString *)  
    .state(NSDictionary *)  
    .channels(NSArrayNSString *> *)  
    .channelGroups(NSArrayNSString *> *)  
    .performWithCompletion(PNSetStateCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringUnique user identifier for which state should be bound. Current `PubNub` user ID will be used by default if not set or set to `nil`.`state`Type: NSDictionaryData which should be bound to specified `uuid` on `channels` / `channelGroups`.`channels`Type: `NSArray<NSString *>`List of the channel names which will store provided `state` information for `uuid`. Not required if `channelGroups` is set.`channelGroups`Type: `NSArray<NSString *>`List of channel group names which will store provided `state` information for `uuid`. Not required if `channels` is set.`completion`Type: PNSetStateCompletionBlockState modification for user on channel / channel group completion block which pass only one argument - request status reports state change was successful or not (`errorData` contains error information in case of failure).

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

#### Get State[​](#get-state-3)

```
`state()  
    .audit()  
    .uuid(NSString *)  
    .channels(NSArrayNSString *> *)  
    .channelGroups(NSArrayNSString *> *)  
    .performWithCompletion(PNGetStateCompletionBlock);  
`
```

*  requiredParameterDescription`uuid`Type: NSStringUnique user identifier for which state should be retrieved. Current `PubNub`  user ID will be used by default if not set or set to `nil`.`channels`Type: `NSArray<NSString *>`List of the channel names from which state information for `uuid` will be pulled out. Not required if `channelGroups` is set.`channelGroups`Type: `NSArray<NSString *>`List of channel group names from which state information for `uuid` will be pulled out. Not required if `channels` is set.`completion` *Type: PNGetStateCompletionBlockState audition for user on channel / channel group completion block which pass two arguments: result - in case of successful request processing data field will contain results of client state retrieve operation; status - in case of error occurred during request processing.

##### Note

This method uses the builder pattern, you can remove the arguments which are optional.

### Basic Usage[​](#basic-usage-4)

#### Set State[​](#set-state-4)

```
`self.client.state().set().state(@{@"state": @"test"})  
    .channels(@[@"channel1", @"channel12"])  
    .channelGroups(@[@"group1", @"group2"])  
    .performWithCompletion(^(PNClientStateUpdateStatus *status) {  
  
        if (!status.isError) {  
            // Client state successfully modified on specified channels and groups.  
        } else {  
            /**  
             Handle client state modification error. Check 'category' property  
             to find out possible reason because of which request did fail.  
             Review 'errorData' property (which has PNErrorData data type) of status  
             object to get additional information about issue.  
  
             Request can be resent using: [status retry]  
`
```
show all 18 lines

#### Get State[​](#get-state-4)

```
`self.client.state().audit().uuid(@"PubNub")**    .channels(@[@"channel1", @"channel12"])  
    .channelGroups(@[@"group1", @"group2"])  
    .performWithCompletion(^(PNClientStateGetResult *result, PNErrorStatus *status) {  
  
        if (!status.isError) {  
            // Handle downloaded state information using: result.data.channels  
        } else {  
            /**  
             Handle client state audit error. Check 'category' property  
             to find out possible reason because of which request did fail.  
             Review 'errorData' property (which has PNErrorData data type) of status  
             object to get additional information about issue.  
  
             Request can be resent using: [status retry]  
`
```
show all 18 linesLast updated on Jun 16, 2025**