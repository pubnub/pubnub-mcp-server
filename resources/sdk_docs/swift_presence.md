# Presence API for Swift Native SDK

Presence lets you track who is online/offline and store custom presence state.

- Join/leave events per channel
- Channel occupancy (user count)
- Channels a UUID is subscribed to
- Presence state associated with users

Requires Presence add-on enabled for your key in the Admin Portal. See Presence overview and Presence Events for event subscriptions.

## Here now

Returns current state for channels: list of UUIDs and total occupancy.

Cache: 3-second response cache time.

### Method(s)

```swift
func hereNow(
  on channels: [String],
  and groups: [String] = [],
  includeUUIDs: Bool = true,
  includeState: Bool = false,
  limit: Int = 1000,
  offset: Int = 0,
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<[String: PubNubPresence], Error>) -> Void)?
)
```

Parameters:
- on: [String] (required) — Channels to return occupancy from.
- and: [String] = [] — Channel groups to return occupancy from. Wildcards not supported.
- includeUUIDs: Bool = true — Set false to omit UUIDs from response.
- includeState: Bool = false — Set true to include presence state per UUID.
- limit: Int = 1000 — Max occupants per channel. Range 0–1000. Use 0 for occupancy counts only (no UUID details).
- offset: Int = 0 — Zero-based index for pagination. Must be >= 0 and used with limit > 0.
- custom: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration/network overrides.
- completion: ((Result<[String: PubNubPresence], Error>) -> Void)? — Async result.

#### Completion handler result

Success: Dictionary mapping channel -> PubNubPresence

```swift
public protocol PubNubPresence {

  /// The channel identifier
  var channel: String { get }

  /// The total number of UUIDs present on the channel
  var occupancy: Int { get set }

  /// The known UUIDs present on the channel
  /// The `count` of this Array may differ from the `occupancy` field
  var occupants: [String] { get set }

  /// Dictionary of UUIDs mapped to their respective presence state data
  var occupantsState: [String: JSONCodable] { get set }
}
```

Failure: Error

### Sample code

#### Get a list of UUIDs subscribed to channel

```swift

```

### Other examples

#### Return occupancy only

You can return only the occupancy information by specifying the channel and setting includeUUIDs to false:

```swift

```

#### Channel group usage

```swift

```

## Where now

Returns the list of channels a UUID is subscribed to.

Timeout events: If the app restarts (or page refreshes) within the heartbeat window, no timeout event is generated.

### Method(s)

```swift
func whereNow(
  for uuid: String,
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<[String: [String]], Error>) -> Void)?
)
```

Parameters:
- for: String (required) — UUID to return channel list for.
- custom: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration/network overrides.
- completion: ((Result<[String: [String]], Error>) -> Void)? — Async result.

#### Completion handler result

- Success: Dictionary mapping UUID -> array of channels with presence.
- Failure: Error

### Sample code

#### Get a list of channels a UUID is subscribed to

```swift

```

## User state

Clients can set dynamic custom state (for example, score, game state, location) per channel. State is not persisted; it’s lost when the client disconnects.

### Method(s)

#### Set state

```swift
func setPresence(
  state: [String: JSONCodableScalar],
  on channels: [String],
  and groups: [String] = [],
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<JSONCodable, Error>) -> Void)?
)
```

Parameters:
- state: [String: JSONCodableScalar] (required) — State dictionary to store. No nested dictionaries allowed. Keys prefixed with pn are reserved. Setting state overwrites previous values. Clear state by passing an empty dictionary.
- on: [String] (required) — Channels to set state on. Pass empty array to not set.
- and: [String] = [] — Channel groups to set state on.
- custom: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration/network overrides.
- completion: ((Result<JSONCodable, Error>) -> Void)? — Async result.

Completion handler result:
- Success: The state as JSONCodable.
- Failure: Error.

#### Get state

```swift
func getPresenceState(
  for uuid: String,
  on channels: [String],
  and groups: [String] = [],
  custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
  completion: ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?
)
```

Parameters:
- for: String (required) — UUID to retrieve state for.
- on: [String] (required) — Channels to get state on. Pass empty array to not get.
- and: [String] = [] — Channel groups to get state on.
- custom: PubNub.RequestConfiguration = PubNub.RequestConfiguration() — Per-request configuration/network overrides.
- completion: ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)? — Async result.

Completion handler result:
- Success: Tuple with uuid and dictionary channel -> state.
- Failure: Error.

### Sample code

#### Set state

```swift

```

#### Get state

```swift

```

### Other examples

#### Converting the response to a JSON dictionary

```swift

```

#### Converting the response to a custom object

```swift
**
```