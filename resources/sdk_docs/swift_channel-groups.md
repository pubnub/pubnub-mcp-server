# Channel Groups API for Swift Native SDK

Channel groups allow bundling thousands of channels under a single name. You can subscribe to a channel group to receive messages from all channels it contains.

##### Channel group operations
- You can't publish to a channel group—only subscribe. To publish, send to each channel individually.

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the PubNub Admin Portal. See the support page on enabling add-on features.

Adds channels to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Swift SDK:

##### Maximum number of channels
You can add up to 200 channels to a channel group per API call.

```
`1func add(  
2    channels: [String],  
3    to group: String,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: `((Result[String: [String]], Error>) -> Void)?`  
6)  
`
```

Parameters:
- channels (required): [String] — List of channels to add.
- to (required): String — Channel Group name.
- custom: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration. See Request Configuration.
- completion: ((Result<(group: String, channels: [String]), Error>) -> Void)? (default: nil) — Async result.

#### Completion handler result[​](#completion-handler-result)
- Success: Tuple (group, channels) of the group and channels added.
- Failure: Error describing the failure.

### Sample code[​](#sample-code)

#### Add channels[​](#add-channels)

##### Reference code
This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

```
1
  

```

## List channels in a channel group[​](#list-channels-in-a-channel-group)

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal. See the support page on enabling add-on features.

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

`Listing Channels` is accomplished by using the following method(s) in the Swift SDK:

```
`1func listChannels(  
2    for group: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
5)  
`
```

Parameters:
- for (required): String — Channel group name.
- custom: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration. See Request Configuration.
- completion: ((Result<(group: String, channels: [String]), Error>) -> Void)? (default: nil) — Async result.

#### Completion handler result[​](#completion-handler-result-1)
- Success: Tuple (group, channels) of the group and its channels.
- Failure: Error describing the failure.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
1
  

```

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal. See the support page on enabling add-on features.

Removes channels from a channel group.

### Method(s)[​](#methods-2)

`Removing Channels` is accomplished by using the following method(s) in the Swift SDK:

```
`1func remove(  
2    channels: [String],  
3    from group: String,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
6)  
`
```

Parameters:
- channels (required): [String] — Channels to remove.
- from (required): String — Channel group name.
- custom: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration.
- completion: ((Result<(group: String, channels: [String]), Error>) -> Void)? (default: nil) — Async result.

#### Completion handler result[​](#completion-handler-result-2)
- Success: Tuple (group, channels) of the group and channels removed.
- Failure: Error describing the failure.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
1
  

```

## List channel groups[​](#list-channel-groups)

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal. See the support page on enabling add-on features.

Lists all channel groups.

### Method(s)[​](#methods-3)

`Listing Channel Groups` is accomplished by using the following method(s) in the Swift SDK:

```
`1func listChannelGroups(  
2    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
3    completion: `((Result[String], Error>) -> Void)?`  
4)  
`
```

Parameters:
- custom: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration. See Request Configuration.
- completion: ((Result<[String], Error>) -> Void)? (default: nil) — Async result.

#### Completion handler result[​](#completion-handler-result-3)
- Success: [String] list of all channel groups.
- Failure: Error describing the failure.

### Sample code[​](#sample-code-3)

#### List channel groups[​](#list-channel-groups-1)

```
1
  

```

## Delete a channel group[​](#delete-a-channel-group)

##### Requires Stream Controller add-on
Enable the Stream Controller add-on for your key in the Admin Portal. See the support page on enabling add-on features.

Removes a channel group.

### Method(s)[​](#methods-4)

`Deleting Channel Group` is accomplished by using the following method(s) in the Swift SDK:

```
`1func remove(  
2    channelGroup: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

Parameters:
- channelGroup (required): String — Channel group to delete.
- custom: PubNub.RequestConfiguration (default: PubNub.RequestConfiguration()) — Per-request configuration. See Request Configuration.
- completion: ((Result<String, Error>) -> Void)? (default: nil) — Async result.

#### Completion handler result[​](#completion-handler-result-4)
- Success: String of the channel group removed.
- Failure: Error describing the failure.

### Sample code[​](#sample-code-4)

#### Delete channel group[​](#delete-channel-group)

```
1
**
```

Last updated on Sep 3, 2025**