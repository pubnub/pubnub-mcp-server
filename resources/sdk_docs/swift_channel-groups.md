# Channel Groups API for Swift Native SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) bundle thousands of [channels](/docs/general/channels/overview) under a single group name for subscription. **You can’t publish to a channel group**—only subscribe; publish to individual channels instead.

##### Channel group operations
- Subscribe to channel groups; publishing requires publishing to each channel.
- Most operations below **require the Stream Controller add-on** enabled in the PubNub [Admin Portal](https://admin.pubnub.com/) (see [support article](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-)).

---

## Add channels to a channel group[​](#add-channels-to-a-channel-group)

##### Requires Stream Controller add-on

Adds channels to a channel group.

### Method(s)[​](#methods)

##### Maximum number of channels
You can add up to **200 channels per API call**.

```
`1func add(  
2    channels: [String],  
3    to group: String,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: `((Result[String: [String]], Error>) -> Void)?`  
6)  
`
```

**Parameters**
- `channels: [String]` (required): list of channels to add.
- `to group: String` (required): channel group to add to.
- `custom requestConfig: PubNub.RequestConfiguration` (optional, default `PubNub.RequestConfiguration()`): per-request customization; see [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration).
- `completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?` (optional, default `nil`): async result callback.

#### Completion handler result[​](#completion-handler-result)
- **Success:** Tuple `(group, channels)` for channels added.
- **Failure:** `Error`.

### Sample code[​](#sample-code)

#### Add channels[​](#add-channels)

##### Reference code
```
1
  

```

---

## List channels in a channel group[​](#list-channels-in-a-channel-group)

##### Requires Stream Controller add-on

Lists all channels in a channel group.

### Method(s)[​](#methods-1)

```
`1func listChannels(  
2    for group: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
5)  
`
```

**Parameters**
- `for group: String` (required): channel group to list.
- `custom requestConfig: PubNub.RequestConfiguration` (optional, default `PubNub.RequestConfiguration()`): per-request customization; see [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration).
- `completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?` (optional, default `nil`): async result callback.

#### Completion handler result[​](#completion-handler-result-1)
- **Success:** Tuple `(group, channels)` for the group and its channels.
- **Failure:** `Error`.

### Sample code[​](#sample-code-1)

#### List channels[​](#list-channels)

```
1
  

```

---

## Remove channels from a channel group[​](#remove-channels-from-a-channel-group)

##### Requires Stream Controller add-on

Removes channels from a channel group.

### Method(s)[​](#methods-2)

```
`1func remove(  
2    channels: [String],  
3    from group: String,  
4    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
5    completion: ((Result(group: String, channels: [String]), Error>) -> Void)?  
6)  
`
```

**Parameters**
- `channels: [String]` (required): channels to remove.
- `from group: String` (required): channel group to remove from.
- `custom requestConfig: PubNub.RequestConfiguration` (optional, default `PubNub.RequestConfiguration()`): per-request customization of PubNub configuration/network session.
- `completion: ((Result<(group: String, channels: [String]), Error>) -> Void)?` (optional, default `nil`): async result callback.

#### Completion handler result[​](#completion-handler-result-2)
- **Success:** Tuple `(group, channels)` for channels removed.
- **Failure:** `Error`.

### Sample code[​](#sample-code-2)

#### Remove channels[​](#remove-channels)

```
1
  

```

---

## List channel groups[​](#list-channel-groups)

##### Requires Stream Controller add-on

Lists all channel groups.

### Method(s)[​](#methods-3)

```
`1func listChannelGroups(  
2    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
3    completion: `((Result[String], Error>) -> Void)?`  
4)  
`
```

**Parameters**
- `custom requestConfig: PubNub.RequestConfiguration` (optional, default `PubNub.RequestConfiguration()`): per-request customization; see [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration).
- `completion: ((Result<[String], Error>) -> Void)?` (optional, default `nil`): async result callback.

#### Completion handler result[​](#completion-handler-result-3)
- **Success:** `[String]` list of channel groups.
- **Failure:** `Error`.

### Sample code[​](#sample-code-3)

#### List channel groups[​](#list-channel-groups-1)

```
1
  

```

---

## Delete a channel group[​](#delete-a-channel-group)

##### Requires Stream Controller add-on

Deletes (removes) a channel group.

### Method(s)[​](#methods-4)

```
`1func remove(  
2    channelGroup: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: ((ResultString, Error>) -> Void)?  
5)  
`
```

**Parameters**
- `channelGroup: String` (required): channel group to delete.
- `custom requestConfig: PubNub.RequestConfiguration` (optional, default `PubNub.RequestConfiguration()`): per-request customization; see [Request Configuration](/docs/sdks/swift/api-reference/configuration#request-configuration).
- `completion: ((Result<String, Error>) -> Void)?` (optional, default `nil`): async result callback.

#### Completion handler result[​](#completion-handler-result-4)
- **Success:** `String` channel group that was removed.
- **Failure:** `Error`.

### Sample code[​](#sample-code-4)

#### Delete channel group[​](#delete-channel-group)

```
1
**
```

Last updated on Sep 3, 2025**