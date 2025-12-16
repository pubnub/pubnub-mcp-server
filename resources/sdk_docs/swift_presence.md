# Presence API for Swift Native SDK (condensed)

Presence tracks online/offline users, channel occupancy, channels a UUID is subscribed to, and per-user presence state.

> **Requires Presence add-on**: Must be enabled for your key in the [Admin Portal](https://admin.pubnub.com/).  
> Presence events details: [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

---

## Here now

Returns current channel presence: unique UUIDs subscribed and total occupancy.

- **Cache**: 3-second response cache time.

### Method(s)

To call `Here Now` you can use:

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

**Parameters (essentials)**  
- `on: [String]` (required): Channels to return occupancy results from.  
- `and: [String] = []`: Channel groups to return occupancy results from (no wildcards).  
- `includeUUIDs: Bool = true`: Set `false` to omit UUID list.  
- `includeState: Bool = false`: Set `true` to include presence state.  
- `limit: Int = 1000`: Max occupants per channel (`0-1000`). Use `0` for counts only.  
- `offset: Int = 0`: Pagination start index (`>= 0`), requires `limit > 0`.  
- `custom: PubNub.RequestConfiguration`: Per-request config override.  
- `completion`: `Result<[String: PubNubPresence], Error>`

#### Completion handler result

##### Success

Dictionary of channels mapped to `PubNubPresence`:

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

##### Failure

`Error` describing the failure.

### Sample code

#### Get a list of UUIDs subscribed to channel

##### Reference code

```
1
  

```

### Other examples

#### Return occupancy only

Set `includeUUIDs` to `false` (and/or `limit = 0`) to return only occupancy:

```
1
  

```

#### Channel group usage

```
1
  

```

---

## Where now

Returns the list of channels a UUID is subscribed to.

- **Timeout events**: If the app restarts/page refreshes within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1func whereNow(  
2    for uuid: String,  
3    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),  
4    completion: `((Result[String: [String]], Error>) -> Void)?`  
5)  
`
```

**Parameters (essentials)**  
- `for uuid: String` (required): UUID to return channel list for.  
- `custom: PubNub.RequestConfiguration`: Per-request config override.  
- `completion`: `Result<[String: [String]], Error>`

#### Completion handler result

##### Success
Dictionary of UUIDs mapped to arrays of channels.

##### Failure
`Error` describing the failure.

### Sample code

#### Get a list of channels a UUID is subscribed to

```
1
  

```

---

## User state

Set/get dynamic custom presence state for a user on one or more channels (for the duration of subscription).

- State is **not persisted**; lost on disconnect. See [Presence State](/docs/general/presence/presence-state).

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

**Parameters (essentials)**  
- `state: [String: JSONCodableScalar]` (required): Flat dictionary only (no nested dictionaries). Keys starting with `pn` are reserved. Overwrites previous values. Clear by passing empty dictionary.  
- `on: [String]` (required): Channels to set state on (empty array = don’t set).  
- `and: [String] = []`: Channel groups to set state on.  
- `custom: PubNub.RequestConfiguration`: Per-request config override.  
- `completion`: `Result<JSONCodable, Error>`

##### Success
Presence state set as `JSONCodable`.

##### Failure
`Error` describing the failure.

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

**Parameters (essentials)**  
- `for uuid: String` (required): UUID to retrieve state for.  
- `on: [String]` (required): Channels to get state on (empty array = don’t get).  
- `and: [String] = []`: Channel groups to get state on (empty array = don’t get).  
- `custom: PubNub.RequestConfiguration`: Per-request config override.  
- `completion`: `Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>`

##### Success
Tuple: `(uuid: String, stateByChannel: [String: JSONCodable])`.

##### Failure
`Error` describing the failure.

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