# Channel Groups API for Swift Native SDK

Channel groups let you bundle many channels under one group name and subscribe to that group to receive messages from all contained channels.

##### Channel group operations

- You can't publish to a channel group; only subscribe to it. Publish to individual channels instead.

## Add channels to a channel group

##### Requires Stream Controller add-on

Adds channels to a channel group.

### Method(s)

```
`1func add(  
2    channels: [String],  
3    to group: String,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: `((Result[String: [String]], Error>) -> Void)?`  
6)  
`
```

- Maximum number of channels: 200 per API call.

Parameters:
- channels
  - Type: [String]
  - Default: n/a
  - Description: List of channels to add to the group.
- to
  - Type: String
  - Default: n/a
  - Description: The channel group name to add channels to.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session.
- completion
  - Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

Completion handler result:
- Success: Tuple with channel group and array of channels added.
- Failure: Error describing the failure.

### Sample code

#### Add channels

##### Reference code

```
1
  
```

## List channels in a channel group

##### Requires Stream Controller add-on

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
- for
  - Type: String
  - Default: n/a
  - Description: The channel group to list channels from.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session.
- completion
  - Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

Completion handler result:
- Success: Tuple with channel group and its channels.
- Failure: Error describing the failure.

### Sample code

#### List channels

```
1
  
```

## Remove channels from a channel group

##### Requires Stream Controller add-on

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
- channels
  - Type: [String]
  - Default: n/a
  - Description: Channels to remove.
- from
  - Type: String
  - Default: n/a
  - Description: The channel group to remove channels from.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session.
- completion
  - Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

Completion handler result:
- Success: Tuple with channel group and channels removed.
- Failure: Error describing the failure.

### Sample code

#### Remove channels

```
1
  
```

## List channel groups

##### Requires Stream Controller add-on

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
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session.
- completion
  - Type: ((Result<[String], Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

Completion handler result:
- Success: List of channel groups.
- Failure: Error describing the failure.

### Sample code

#### List channel groups

```
1
  
```

## Delete a channel group

##### Requires Stream Controller add-on

Removes a channel group.

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
- channelGroup
  - Type: String
  - Default: n/a
  - Description: The channel group to delete.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session.
- completion
  - Type: ((Result<String, Error>) -> Void)?
  - Default: nil
  - Description: Async result of the call.

Completion handler result:
- Success: The channel group that was removed.
- Failure: Error describing the failure.

### Sample code

#### Delete channel group

```
1
**```