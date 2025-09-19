# Presence API – Rust SDK (condensed)

Presence lets you query real-time occupancy information and manage per-user state.  
Feature flag: **fullpresence** (must be enabled in the Admin Portal).

---

## here_now()

Real-time snapshot of channel occupancy.  
Response is cached for 3 s.

```rust
pubnub
    .here_now()
    .channels(Vec<String>)        // required – channels to query
    .channel_groups(Vec<String>)  // optional – channel groups to query
    .include_state(bool)          // default false – include per-user state
    .include_user_ids(bool)       // default true  – include UUID list
    .execute()
```

Returns `HereNowResult`:
* `total_channels: u32`
* `total_occupancy: u32`
* `channels: Vec<HereNowChannel>`

`HereNowChannel`  
* `name: String`
* `occupancy: u32`
* `occupants: Vec<HereNowUser>`

`HereNowUser`  
* `user_id: String`
* `state: serde_json::Value` (or `Vec<u8>` without `serde`)

---

## where_now()

List channels to which a given user ID is currently subscribed.

```rust
pubnub
    .where_now()
    .user_id(String)   // defaults to the UUID in PubNub config
    .execute()
```

Returns `WhereNowResult`:
* `channels: Vec<String>`

---

## Presence state (set / get)

Key-value metadata attached to a user on specific channels or channel groups.  
State payload must be a JSON object.

### set_presence_state()

```rust
pubnub
    .set_presence_state(T: Serialize) // required state JSON
    .channels(Vec<String>)            // optional channels
    .channel_groups(Vec<String>)      // optional channel groups
    .user_id(String)                  // defaults to configured UUID
    .execute()
```

Returns `SetStateResult`:
* `channel: String`
* `state: serde_json::Value` (or `Vec<u8>`)

### get_presence_state()

```rust
pubnub
    .get_presence_state()
    .channels(Vec<String>)            // optional channels
    .channel_groups(Vec<String>)      // optional channel groups
    .user_id(String)                  // defaults to configured UUID
    .execute()
```

Returns `GetStateResult`:
* `state: Vec<GetStateInfo>`

`GetStateInfo`
* `channel_name: String`
* `state: serde_json::Value` (or `Vec<u8>`)

---

Last updated: **Jul 15 2025**