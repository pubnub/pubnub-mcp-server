# Presence API for Swift Native SDK

Presence lets you track who is online/offline and store custom state. Presence shows:
- When a user joins or leaves a channel
- Occupancy (how many users are subscribed to a channel)
- Which channels a user/device is subscribed to
- Presence state associated with users

Learn more: Presence overview.

## Here now

Requires Presence add-on enabled in Admin Portal. To receive presence events, see Presence Events.

Returns the current state of a channel: list of UUIDs subscribed and total occupancy count.

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
- on (required): [String] — Channel list to return occupancy for.
- and (groups): [String], default [] — Channel groups to return occupancy for. Wildcards not supported.
- includeUUIDs: Bool, default true — Set to false to omit UUIDs (occupancy only).
- includeState: Bool, default false — Set to true to include presence state.
- limit: Int, default 1000 — Max occupants per channel. Range 0–1000. Use 0 for occupancy without user details.
- offset: Int, default 0 — Zero-based starting index for pagination. Must be >= 0. Requires limit > 0.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration() — Per-request config/session overrides.
- completion: ((Result<[String: PubNubPresence], Error>) -> Void)? — Async result.

#### Completion handler result

Success: Dictionary of channels mapped to PubNubPresence:

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

Set includeUUIDs/UUIDs to false to return only occupancy for a channel.

```
1
  

```

#### Channel group usage

```
1
  

```

## Where now

Requires Presence add-on enabled in Admin Portal. To receive presence events, see Presence Events.

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or page refreshes) within the heartbeat window, no timeout event is generated.

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
- for: String — The UUID to return channels for.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration() — Per-request config/session overrides.
- completion: ((Result<[String: [String]], Error>) -> Void)? — Async result.

#### Completion handler result

- Success: Dictionary of UUIDs mapped to their array of channels with presence.
- Failure: Error.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

## User state

Requires Presence add-on enabled in Admin Portal. To receive presence events, see Presence Events.

Clients can set dynamic custom state (for example: score, game state, location) for users on channels while subscribed. State isn’t persisted; it’s lost when the client disconnects. See Presence State.

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
- state (required): [String: JSONCodableScalar] — State dictionary to store. No nested dictionaries; keys starting with pn are reserved. Setting overwrites previous values. Clear state by passing an empty dictionary.
- on (required): [String] — Channels to set state on. Pass [] to skip.
- and (groups): [String] — Channel groups to set state on.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration() — Per-request config/session overrides.
- completion: ((Result<JSONCodable, Error>) -> Void)? — Async result.

Completion handler result:
- Success: The state set as JSONCodable.
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
- for: String — UUID to retrieve state for.
- on: [String] — Channels to get state on. Pass [] to skip.
- and (groups): [String], default [] — Channel groups to get state on.
- custom: PubNub.RequestConfiguration, default PubNub.RequestConfiguration() — Per-request config/session overrides.
- completion: ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)? — Async result.

Completion handler result:
- Success: Tuple (uuid, stateByChannel) where stateByChannel is [channel: JSONCodable].
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

Last updated on Nov 10, 2025**