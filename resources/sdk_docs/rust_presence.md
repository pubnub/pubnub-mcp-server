# Presence API for Rust SDK

Presence tracks online/offline status and custom state:
- Join/leave events
- Occupancy (user count) per channel
- Channels a user/device is subscribed to
- Presence state for users

Learn more: Presence overview.

Add any of the following features to Cargo.toml:

```
[dependencies]
# full
pubnub = { version = "0.7.0", features = ["full"] }
# Presence
pubnub = { version = "0.7.0", features = ["presence"] }
```

For all features, see Available features.

### Available in features
full, presence

## Here now

Requires Presence (enable in Admin Portal). See Presence Events to receive presence events.

Returns the current state of channels: list of user IDs (UUIDs) and total occupancy.

Cache: 3-second response cache time.

### Method(s)

```
pubnub
    .here_now()
    .channels(Vec<String>)
    .channel_groups(Vec<String>)
    .include_state(bool)
    .include_user_ids(bool)
    .execute()
```

Parameters:
- channels() — Type: Vec<String>, Default: n/a. Channels to get details of.
- channel_groups() — Type: Vec<String>, Default: n/a. Channel groups to get details of.
- include_state() — Type: bool, Default: false. If true, include presence state for users.
- include_user_ids() — Type: bool, Default: true. If true, include user IDs of connected clients.

### Sample code

```

```

### Returns

here_now() returns HereNowResult:
- total_channels: u32 — Total number of channels.
- total_occupancy: u32 — Number of all users in the provided channels.
- channels: Vec<HereNowChannel> — Per-channel details.

HereNowChannel:
- name: String — Channel name.
- occupancy: u32 — Number of users in the channel.
- occupants: Vec<HereNowUser> — Users in the channel.

HereNowUser:
- user_id: String — User ID.
- state: serde_json::Value — User state. If not using default serde, this field is Vec<u8>.

## Where now

Requires Presence (enable in Admin Portal). See Presence Events to receive presence events.

Get the list of channels a user ID is currently subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
pubnub
    .where_now()
    .user_id(String)
    .execute()
```

Parameters:
- user_id() — Type: String, Default: User ID provided in PubNub config. The user ID to query.

### Sample code

```

```

### Returns

where_now() returns WhereNowResult:
- channels: Vec<String> — Channels where the user ID is present.

## User state

Requires Presence (enable in Admin Portal). See Presence Events to receive presence events.

Set/get key/value state pairs per user ID. State must be a JSON object.

### Method(s)

#### Set state

```
pubnub
    .set_presence_state(T: Serialize)
    .channels(Vec<String>)
    .channel_groups(Vec<String>)
    .user_id(String)
    .execute()
```

Parameters:
- set_presence_state() — Type: T: Serialize, Default: n/a. JSON object state to set.
- channels() — Type: Vec<String>, Default: n/a. Channels to set state on.
- channel_groups() — Type: Vec<String>, Default: n/a. Channel groups to set state on.
- user_id() — Type: String, Default: User ID provided in PubNub config. The user ID to set state for.

#### Get state

```
pubnub
    .get_presence_state()
    .channels(Vec<String>)
    .channel_groups(Vec<String>)
    .user_id(String)
    .execute()
```

Parameters:
- channels() — Type: Vec<String>, Default: n/a. Channels to get state of.
- channel_groups() — Type: Vec<String>, Default: n/a. Channel groups to get state of.
- user_id() — Type: String, Default: User ID provided in PubNub config. The user ID to get state for.

### Sample code

```

```

### Returns

set_presence_state() returns SetStateResult:
- channel: String — Channel the state was set on.
- state: serde_json::Value — User state. If not using default serde, this field is Vec<u8>.

get_presence_state() returns GetStateResult:
- state: Vec<GetStateInfo> — State entries.

GetStateInfo:
- channel_name: String — Channel name the state was set on.
- state: serde_json::Value — User state. If not using default serde, this field is Vec<u8>.