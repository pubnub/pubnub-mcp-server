# Presence API for Rust SDK

Presence tracks online/offline status and custom state, including:
- Join/leave events per channel
- Channel occupancy (user count)
- Channels a user/device is subscribed to
- Presence state per user

Add features to Cargo.toml:
```
`[dependencies]  
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# Presence  
pubnub = { version = "0.7.0", features = ["presence"] }  
`
```

Available in features: full, presence

All methods below require the Presence add-on enabled for your key in the Admin Portal.

## Here now

Returns current state of channels: list of UUIDs and total occupancy. Cache: 3-second response cache.

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
- channels() — Type: Vec<String>, Default: n/a. Channels to get details of.
- channel_groups() — Type: Vec<String>, Default: n/a. Channel groups to get details of.
- include_state() — Type: bool, Default: false. Include presence states for users.
- include_user_ids() — Type: bool, Default: true. Include user IDs of connected clients.
- limit() — Type: usize, Default: 1000. Max occupants per channel (0–1000). Use 0 for occupancy counts only (no user details).
- offset() — Type: Option<usize>, Default: None. Zero-based starting index for pagination. Requires limit > 0. Only included when offset > 0.

### Sample code
```
1
  

```

### Returns
HereNowResult:
- total_channels: u32 — Total number of channels.
- total_occupancy: u32 — Total users in provided channels.
- channels: Vec<HereNowChannel> — Per-channel details.

HereNowChannel:
- name: String — Channel name.
- occupancy: u32 — User count in channel.
- occupants: Vec<HereNowUser> — Users in channel.

HereNowUser:
- user_id: String — User ID.
- state: serde_json::Value — User state; if not using default serde, type is Vec<u8>.

## Where now

Lists channels a user ID is currently subscribed to.

Note on timeouts: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)
```
`1pubnub  
2    .where_now()  
3    .user_id(String)  
4    .execute()  
`
```

Parameters:
- user_id() — Type: String, Default: User ID from config. User ID to query.

### Sample code
```
1
  

```

### Returns
WhereNowResult:
- channels: Vec<String> — Channels where the user ID is present.

## User state

Set/get key/value pairs specific to a user ID. Presence state must be a JSON object.

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
- set_presence_state() — Type: T: Serialize, Default: n/a. JSON object state to set.
- channels() — Type: Vec<String>, Default: n/a. Channels to set state on.
- channel_groups() — Type: Vec<String>, Default: n/a. Channel groups to set state on.
- user_id() — Type: String, Default: User ID from config. User ID to set state for.

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
- channels() — Type: Vec<String>, Default: n/a. Channels to get state of.
- channel_groups() — Type: Vec<String>, Default: n/a. Channel groups to get state of.
- user_id() — Type: String, Default: User ID from config. User ID to get state for.

### Sample code
```
1
  

```

### Returns
set_presence_state() → SetStateResult:
- channel: String — Channel the state was set on.
- state: serde_json::Value — User state; if not using default serde, type is Vec<u8>.

get_presence_state() → GetStateResult:
- state: Vec<GetStateInfo> — State entries.

GetStateInfo:
- channel_name: String — Channel the state was set on.
- state: serde_json::Value — User state; if not using default serde, type is Vec<u8>.