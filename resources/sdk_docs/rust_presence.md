# Presence API for Rust SDK

Presence lets you track who is online/offline and store custom state information:
- Join/leave events
- Channel occupancy
- Channels a user/device is subscribed to
- Presence state for users

Add one of the following features to Cargo.toml:

```
`[dependencies]  
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# Presence  
pubnub = { version = "0.7.0", features = ["presence"] }  
`
```

Available in features
fullpresence

Requires Presence add-on enabled for your key in the Admin Portal. See Presence Events for how to receive presence events.

## Here now

Returns current state of channels: unique user IDs (UUIDs) subscribed and occupancy counts.

Cache: 3-second response cache time.

### Method(s)

```
`1pubnub  
2    .here_now()  
3    .channels(VecString>)  
4    .channel_groups(VecString>)  
5    .include_state(bool)  
6    .include_user_ids(bool)  
7    .limit(usize)  
8    .offset(Optionusize>)  
9    .execute()  
`
```

Parameters:
- channels() — Type: Vec<String>, required. Channels to get details of.
- channel_groups() — Type: Vec<String>, required. Channel groups to get details of.
- include_state() — Type: bool, default: false. Include presence state for users.
- include_user_ids() — Type: bool, default: true. Include connected user IDs.
- limit() — Type: usize, default: 1000. Max occupants per channel; valid 0–1000. Use 0 for occupancy counts only (no user details).
- offset() — Type: Option<usize>, default: None. Zero-based index for pagination; requires limit > 0. Only included when offset > 0.

### Sample code

```
1
  

```

### Returns

HereNowResult:
- total_channels: u32 — Total channels in the response.
- total_occupancy: u32 — Total users across provided channels.
- channels: Vec<HereNowChannel> — Per-channel details.

HereNowChannel:
- name: String — Channel name.
- occupancy: u32 — Users in the channel.
- occupants: Vec<HereNowUser> — User details.

HereNowUser:
- user_id: String — User ID.
- state: serde_json::Value — User state (Vec<u8> if not using default serde).

## Where now

Returns the list of channels to which a given user ID is currently subscribed.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1pubnub  
2    .where_now()  
3    .user_id(String)  
4    .execute()  
`
```

Parameter:
- user_id() — Type: String, default: User ID from PubNub config. User ID to look up.

### Sample code

```
1
  

```

### Returns

WhereNowResult:
- channels: Vec<String> — Channels where the user ID is present.

## User state

Set/get key-value pairs as presence state for a user ID. Presence state must be a JSON object.

### Method(s)

#### Set state

```
`1pubnub  
2    .set_presence_state(T: Serialize)  
3    .channels(VecString>)  
4    .channel_groups(VecString>)  
5    .user_id(String)  
6    .execute()  
`
```

Parameters:
- set_presence_state() — Type: T: Serialize, required. State as a JSON object.
- channels() — Type: Vec<String>, required. Channels to set state on.
- channel_groups() — Type: Vec<String>, required. Channel groups to set state on.
- user_id() — Type: String, default: User ID from PubNub config. User ID to set state for.

#### Get state

```
`1pubnub  
2    .get_presence_state()  
3    .channels(VecString>)  
4    .channel_groups(VecString>)  
5    .user_id(String)  
6    .execute()  
`
```

Parameters:
- channels() — Type: Vec<String>, required. Channels to get state for.
- channel_groups() — Type: Vec<String>, required. Channel groups to get state for.
- user_id() — Type: String, default: User ID from PubNub config. User ID to get state for.

### Sample code

```
1
  

```

### Returns

set_presence_state() → SetStateResult:
- channel: String — Channel where state was set.
- state: serde_json::Value — User state (Vec<u8> if not using default serde).

get_presence_state() → GetStateResult:
- state: Vec<GetStateInfo> — State entries.

GetStateInfo:
- channel_name: String — Channel name.
- state: serde_json::Value — User state (Vec<u8> if not using default serde).