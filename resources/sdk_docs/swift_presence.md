# Presence API for Swift Native SDK (Condensed)

Presence tracks who is online/offline and stores custom state:
- Join/leave events
- Channel occupancy (user count)
- Channels a UUID is subscribed to
- Presence state per user

Requires Presence: Enable the Presence add-on for your key in the Admin Portal. For event delivery details, see Presence Events.

## Here now

Returns current state for channels: UUID list and occupancy count.

Cache: 3-second response cache.

### Method(s)

```
`1func hereNow(  
2    on channels: [String],  
3    and groups: [String] = [],  
4    includeUUIDs: Bool = true,  
5    includeState: Bool = false,  
6    limit: Int = 1000,  
7    offset: Int = 0,  
8    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
9    completion: ((Result[String: PubNubPresence], Error>) -> Void)?  
10)  
`
```

Parameters:
- on (Type: [String], Default: n/a): Channels to return occupancy from.
- and (Type: [String], Default: []): Channel groups to return occupancy from. Wildcards not supported.
- includeUUIDs (Type: Bool, Default: true): Set to false to disable returning UUIDs.
- includeState (Type: Bool, Default: false): Set true to include presence state.
- limit (Type: Int, Default: 1000): Max occupants per channel. Range 0–1000. Use 0 for counts only (no user details).
- offset (Type: Int, Default: 0): Zero-based start index for pagination. Must be >= 0. Requires limit > 0.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<[String: PubNubPresence], Error>) -> Void)?, Default: nil): Async result.

#### Completion handler result

Success:

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

##### Reference code

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

Returns channels a UUID is subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

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
- for (Type: String, Default: n/a): UUID to return channels for.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<[String: [String]], Error>) -> Void)?, Default: nil): Async result.

#### Completion handler result

- Success: Dictionary of UUIDs mapped to arrays of channels with presence.
- Failure: Error describing the failure.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

## User state

Clients can set dynamic custom state (for example, score, location) on one or more channels while subscribed. State isn’t persisted; it’s lost on disconnect.

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
- state (Type: [String: JSONCodableScalar], Default: n/a): State dictionary to store. No nested dictionaries; keys starting with pn are reserved. Overwrites previous state. Clear by passing an empty dictionary.
- on (Type: [String], Default: n/a): Channels to set state on. Pass empty array to not set.
- and (Type: [String], Default: n/a): Channel groups to set state on.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<JSONCodable, Error>) -> Void)?, Default: nil): Async result.

Completion handler result:
- Success: State set as JSONCodable.
- Failure: Error.

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
- for (Type: String, Default: n/a): UUID to retrieve state for.
- on (Type: [String], Default: n/a): Channels to get state on. Pass empty array to not get.
- and (Type: [String], Default: []): Channel groups to get state on. Pass empty array to not get.
- custom (Type: PubNub.RequestConfiguration, Default: PubNub.RequestConfiguration()): Per-request configuration.
- completion (Type: ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?, Default: nil): Async result.

Completion handler result:
- Success: Tuple (uuid, stateByChannel dictionary).
- Failure: Error.

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