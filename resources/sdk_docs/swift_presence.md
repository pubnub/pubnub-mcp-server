# Presence API for Swift Native SDK

Presence tracks who is online/offline and stores custom state:
- Join/leave events per channel
- Channel occupancy (user count)
- Channels a user/device is subscribed to
- Presence state per user

Requires Presence add-on enabled for your key in the Admin Portal. For presence events, see Presence Events.

## Here now

Returns current channel state: list of UUIDs subscribed and total occupancy.

Cache: 3-second response cache time.

### Method(s)

```
`1func hereNow(  
2    on channels: [String],  
3    and groups: [String] = [],  
4    includeUUIDs: Bool = true,  
5    includeState: Bool = false,  
6    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
7    completion: ((Result[String: PubNubPresence], Error>) -> Void)?  
8)  
`
```

Parameters:
- on: Type [String], default n/a. Channels to return occupancy from.
- and: Type [String], default []. Channel groups to return occupancy from. Wildcards not supported.
- includeUUIDs: Type Bool, default true. Set to false to disable returning UUIDs.
- includeState: Type Bool, default false. Set to true to include presence state.
- custom: Type PubNub.RequestConfiguration, default PubNub.RequestConfiguration(). Per-request config.
- completion: Type ((Result<[String: PubNubPresence], Error>) -> Void)?, default nil. Async result.

#### Completion handler result

Success: Dictionary of channels mapped to PubNubPresence.

```
1public protocol PubNubPresence {  
2
  
3    /// The channel identifier  
4    var channel: String { get }  
5
  
6    /// The total number of UUIDs present on the channel  
7    var occupancy: Int { get set }  
8
  
9    /// The known UUIDs present on the channel  
10    ///  
11    /// The `count` of this Array may differ from the `occupancy` field  
12    var occupants: [String] { get set }  
13
  
14    /// The Dictionary of UUIDs mapped to their respective presence state data  
15    var occupantsState: [String: JSONCodable] { get set }  
16}  

```

Failure: Error describing the failure.

### Sample code

#### Get a list of UUIDs subscribed to channel

```
1
  

```

### Other examples

#### Return occupancy only

You can return only occupancy for a single channel by specifying the channel and setting UUIDs to false:

```
1
  

```

#### Channel group usage

```
1
  

```

## Where now

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or the page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1func whereNow(  
2    for uuid: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: `((Result[String: [String]], Error>) -> Void)?`  
5)  
`
```

Parameters:
- for: Type String, default n/a. UUID to return channel list for.
- custom: Type PubNub.RequestConfiguration, default PubNub.RequestConfiguration(). Per-request config.
- completion: Type ((Result<[String: [String]], Error>) -> Void)?, default nil. Async result.

#### Completion handler result

- Success: Dictionary of UUIDs mapped to their array of channels.
- Failure: Error describing the failure.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

## User state

Clients can set dynamic custom state (for example, score, location) on channels for as long as the user stays subscribed. State is not persisted; it’s lost when the client disconnects.

### Method(s)

#### Set state

```
`1func setPresence(  
2    state: [String: JSONCodableScalar],  
3    on channels: [String],  
4    and groups: [String] = [],  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((ResultJSONCodable, Error>) -> Void)?  
7)  
`
```

Parameters:
- state: Type [String: JSONCodableScalar], default n/a. State dictionary to store. No nested dictionaries; keys starting with pn are reserved. Overwrites previous values. Pass empty dict to clear.
- on: Type [String], default n/a. Channels to set state on. Pass empty array to not set.
- and: Type [String], default n/a. Channel groups to set state on.
- custom: Type PubNub.RequestConfiguration, default PubNub.RequestConfiguration(). Per-request config.
- completion: Type ((Result<JSONCodable, Error>) -> Void)?, default nil. Async result.

Completion handler result:
- Success: State set as JSONCodable.
- Failure: Error describing the failure.

#### Get state

```
`1func getPresenceState(  
2    for uuid: String,  
3    on channels: [String],  
4    and groups: [String] = [],  
5    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
6    completion: ((Result(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?  
7)  
`
```

Parameters:
- for: Type String, default n/a. UUID to retrieve the state for.
- on: Type [String], default n/a. Channels to get the state on. Pass empty array to not get.
- and: Type [String], default []. Channel groups to get the state on. Pass empty array to not get.
- custom: Type PubNub.RequestConfiguration, default PubNub.RequestConfiguration(). Per-request config.
- completion: Type ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?, default nil. Async result.

Completion handler result:
- Success: Tuple (uuid, stateByChannel) where stateByChannel is a dictionary of channels to their state.
- Failure: Error describing the failure.

### Sample code

#### Set state

```
1
  

```

#### Get state

```
1
  

```

### Other examples

#### Converting the response to a JSON dictionary

```
1
  

```

#### Converting the response to a custom object

```
1
**
```

Last updated on Sep 3, 2025**