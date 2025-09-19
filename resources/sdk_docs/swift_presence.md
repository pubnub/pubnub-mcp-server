# Presence API – Swift Native SDK (Condensed)

Presence lets you query real-time occupancy, subscription lists, and custom state. All methods below require the **Presence** add-on to be enabled for your keys.

---

## Here Now

Return current occupancy for one or more channels or channel groups.

```swift
func hereNow(
    on channels: [String],
    and groups: [String] = [],
    includeUUIDs: Bool = true,
    includeState: Bool = false,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String: PubNubPresence], Error>) -> Void)?
)
```

Parameters  
• `channels` – channels to query (required)  
• `groups` – channel groups to query (default `[]`)  
• `includeUUIDs` – `false` to omit UUID list (default `true`)  
• `includeState` – `true` to include per-UUID state (default `false`)  
• `requestConfig` – per-request configuration (default `.init()`)  
• `completion` – async `Result` (dictionary keyed by channel)

Cache: 3 s.

### Response Object

```swift
public protocol PubNubPresence {

  var channel: String { get }       // Channel ID
  var occupancy: Int { get set }    // Total UUIDs
  var occupants: [String] { get set }              // Known UUIDs
  var occupantsState: [String: JSONCodable] { get set } // UUID → state
}
```

#### Sample

```swift
// Get UUID list + state for “lobby”
```

```
// (empty block preserved)
```

---

## Where Now

List channels a specific UUID is currently subscribed to.

```swift
func whereNow(
    for uuid: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String: [String]], Error>) -> Void)?
)
```

Parameters  
• `uuid` – UUID to inspect (required)  
• `requestConfig` – per-request configuration (default `.init()`)  
• `completion` – async `Result` (`uuid` → `[channels]`)

Heartbeat note: restart within the heartbeat window prevents a timeout event.

#### Sample

```swift
// Get channels for UUID “user-123”
```

```
// (empty block preserved)
```

---

## User State

Store ephemeral, per-channel key/value data for a UUID.

### Set State

```swift
func setPresence(
    state: [String: JSONCodableScalar],
    on channels: [String],
    and groups: [String] = [],
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<JSONCodable, Error>) -> Void)?
)
```

Parameters  
• `state` – flat dictionary (keys starting with `pn` are reserved)  
• `channels` – channels to set state on  
• `groups` – channel groups  
• `requestConfig`, `completion` – as above

Success: returned state as `JSONCodable`.

### Get State

```swift
func getPresenceState(
    for uuid: String,
    on channels: [String],
    and groups: [String] = [],
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?
)
```

Success: `(uuid, stateByChannel)` where `stateByChannel` is `[channel: state]`.

#### Samples

```swift
// Set score for player on “game-room”
```

```
// (empty block preserved)
```

```swift
// Retrieve state for UUID on multiple channels
```

```
// (empty block preserved)
```

### Converting Responses

```swift
// (empty block preserved)
```

```swift
**              // (empty block preserved)
```

_Last updated: Jul 15 2025_