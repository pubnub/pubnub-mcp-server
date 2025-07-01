# Presence API – Swift Native SDK

Presence methods require the Presence add-on to be enabled for your keys.

---

## Here Now

Cache: 3 s

```
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
• **on** `[String]` – target channels (required)  
• **and** `[String] = []` – channel groups  
• **includeUUIDs** `Bool = true` – `false` omits UUID list  
• **includeState** `Bool = false` – `true` includes presence state  
• **custom** `PubNub.RequestConfiguration` – per-request overrides  
• **completion** `Result<[String: PubNubPresence], Error>` – async result  

`PubNubPresence`:

```
public protocol PubNubPresence {
  var channel: String { get }
  var occupancy: Int { get set }
  var occupants: [String] { get set }
  var occupantsState: [String: JSONCodable] { get set }
}
```

Success: `[channel : PubNubPresence]`  
Failure: `Error`

### Examples

```
  
```

```
  
```

```
  
```

---

## Where Now

```
func whereNow(
    for uuid: String,
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<[String: [String]], Error>) -> Void)?
)
```

Parameters  
• **for** `String` – UUID to query (required)  
• **custom** `PubNub.RequestConfiguration`  
• **completion** `Result<[String: [String]], Error>`  

Success: `[uuid : [channels]]`  
Failure: `Error`

Example:

```
  
```

---

## User State

### Set State

```
func setPresence(
    state: [String: JSONCodableScalar],
    on channels: [String],
    and groups: [String] = [],
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<JSONCodable, Error>) -> Void)?
)
```

Parameters  
• **state** `[String: JSONCodableScalar]` – custom state (no nesting; keys starting with `pn` reserved)  
• **on** `[String]` – channels (required)  
• **and** `[String] = []` – channel groups  
• **custom** `PubNub.RequestConfiguration`  
• **completion** `Result<JSONCodable, Error>`  

Success: stored state  
Failure: `Error`

### Get State

```
func getPresenceState(
    for uuid: String,
    on channels: [String],
    and groups: [String] = [],
    custom requestConfig: PubNub.RequestConfiguration = PubNub.RequestConfiguration(),
    completion: ((Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>) -> Void)?
)
```

Parameters  
• **for** `String` – UUID (required)  
• **on** `[String]` – channels  
• **and** `[String] = []` – channel groups  
• **custom** `PubNub.RequestConfiguration`  
• **completion** `Result<(uuid: String, stateByChannel: [String: JSONCodable]), Error>`  

Success: `(uuid, [channel : state])`  
Failure: `Error`

### Examples

```
  
```

```
  
```

#### Response to JSON Dictionary

```
  
```

#### Response to custom object

```
**
```

_Last updated: Jun 16 2025_