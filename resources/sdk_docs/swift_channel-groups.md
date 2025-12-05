# Channel Groups API for Swift Native SDK

Channel groups let you bundle many channels into a named group you can subscribe to. You can’t publish to a channel group—publish to individual channels instead.

##### Channel group operations
- Subscribe to channel groups to receive messages from their member channels.
- Publishing to a channel group is not supported.

## Add channels to a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Adds channels to a channel group.

### Method(s)

Maximum number of channels: Up to 200 channels per API call.

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
- channels (required) — Type: [String], Default: n/a. List of channels to add.
- to — Type: String, Default: n/a. Channel group to add channels to.
- custom — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?, Default: nil. Async result.

#### Completion handler result
- Success: Tuple (group, channels) with the channel group and the channels added.
- Failure: Error describing the failure.

### Sample code

#### Add channels
##### Reference code
```
1
  

```

## List channels in a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Lists all channels in a channel group.

### Method(s)

```
`1func listChannels(  
2    for group: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
5)  
`
```

Parameters:
- for — Type: String, Default: n/a. Channel group to list channels from.
- custom — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?, Default: nil. Async result.

#### Completion handler result
- Success: Tuple (group, channels) with the channel group and its channels.
- Failure: Error describing the failure.

### Sample code

#### List channels
```
1
  

```

## Remove channels from a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Removes channels from a channel group.

### Method(s)

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
- channels (required) — Type: [String], Default: n/a. Channels to remove.
- from — Type: String, Default: n/a. Channel group to remove channels from.
- custom — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?, Default: nil. Async result.

#### Completion handler result
- Success: Tuple (group, channels) with the channel group and channels removed.
- Failure: Error describing the failure.

### Sample code

#### Remove channels
```
1
  

```

## List channel groups

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Lists all channel groups.

### Method(s)

```
`1func listChannelGroups(  
2    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
3    completion: `((Result[String], Error>) -> Void)?`  
4)  
`
```

Parameters:
- custom — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<[String], Error>) -> Void)?, Default: nil. Async result.

#### Completion handler result
- Success: Array of all channel groups.
- Failure: Error describing the failure.

### Sample code

#### List channel groups
```
1
  

```

## Delete a channel group

##### Requires Stream Controller add-on
Enable Stream Controller for your key in the Admin Portal. See the support page for enabling add-ons.

Deletes a channel group.

### Method(s)

```
`1func remove(  
2    channelGroup: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

Parameters:
- channelGroup — Type: String, Default: n/a. Channel group to delete.
- custom — Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration(). Per-request configuration.
- completion — Type: ((Result<String, Error>) -> Void)?, Default: nil. Async result.

#### Completion handler result
- Success: String of the channel group that was removed.
- Failure: Error describing the failure.

### Sample code

#### Delete channel group
```
1
**
```

Last updated on Sep 3, 2025**