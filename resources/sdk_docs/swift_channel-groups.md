# Channel Groups API for Swift Native SDK

Channel groups allow bundling many channels into a named group you can subscribe to.

- Channel group operations: You can't publish to a channel group—only subscribe. To publish, send to each channel individually.
- Requires Stream Controller add-on: All Channel Group operations require the Stream Controller add-on enabled for your key in the PubNub Admin Portal.

## Add channels to a channel group

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

- channels
  - Type: [String]
  - Default: n/a
  - Description: List of channels to add to the group.
- to
  - Type: String
  - Default: n/a
  - Description: The Channel Group to add the list of channels to.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session. See Request Configuration.
- completion
  - Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?
  - Default: nil
  - Description: Async result callback.

Maximum number of channels: Up to 200 channels can be added per API call.

#### Completion handler result

- Success: Tuple containing the channel group and the array of channels added.
- Failure: Error describing the failure.

### Sample code

#### Add channels

```
1
  

```

## List channels in a channel group

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

- for
  - Type: String
  - Default: n/a
  - Description: The channel group to list channels on.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session. See Request Configuration.
- completion
  - Type: ((Result<(group: String, channels: [String]), Error>) -> Void)?
  - Default: nil
  - Description: Async result callback.

#### Completion handler result

- Success: Tuple containing the channel group and the array of its channels.
- Failure: Error describing the failure.

### Sample code

#### List channels

```
1
  

```

## Remove channels from a channel group

Removes channels from the channel group.

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

- channels
  - Type: [String]
  - Default: n/a
  - Description: The list of channels to remove from the channel group.
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
  - Description: Async result callback.

#### Completion handler result

- Success: Tuple containing the channel group and the array of channels removed.
- Failure: Error describing the failure.

### Sample code

#### Remove channels

```
1
  

```

## List channel groups

Lists all channel groups.

### Method(s)

```
`1func listChannelGroups(  
2    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
3    completion: `((Result[String], Error>) -> Void)?`  
4)  
`
```

- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session. See Request Configuration.
- completion
  - Type: ((Result<[String], Error>) -> Void)?
  - Default: nil
  - Description: Async result callback.

#### Completion handler result

- Success: List of all channel groups.
- Failure: Error describing the failure.

### Sample code

#### List channel groups

```
1
  

```

## Delete a channel group

Removes the channel group.

### Method(s)

```
`1func remove(  
2    channelGroup: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

- channelGroup
  - Type: String
  - Default: n/a
  - Description: The channel group to delete.
- custom
  - Type: PubNub.RequestConfiguration
  - Default: PubNub.RequestConfiguration()
  - Description: Per-request customization of PubNub configuration or network session. See Request Configuration.
- completion
  - Type: ((Result<String, Error>) -> Void)?
  - Default: nil
  - Description: Async result callback.

#### Completion handler result

- Success: The channel group that was removed.
- Failure: Error describing the failure.

### Sample code

#### Delete channel group

```
1
**
```