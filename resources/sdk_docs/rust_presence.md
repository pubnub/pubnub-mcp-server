# Presence API for Rust SDK

Presence tracks online/offline users, occupancy, subscriptions, and presence state (custom key/value data). See Presence overview for more details.

Add any of the following features to Cargo.toml:

```
`[dependencies]  
# full  
pubnub = { version = "0.7.0", features = ["full"] }  
# Presence  
pubnub = { version = "0.7.0", features = ["presence"] }  
`
```

For a list of all features, refer to Available features.

### Available in features
fullpresence

## Here now

##### Requires Presence

Presence add-on must be enabled for your key in the Admin Portal. For how to receive presence events, see Presence Events.

Returns the current state of channels: UUIDs subscribed and total occupancy.

##### Cache

This method has a 3-second response cache time.

### Method(s)

To call here_now(), use the following method in the Rust SDK:

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
- include_state() — Type: bool, Default: false. If true, includes user presence states.
- include_user_ids() — Type: bool, Default: true. If true, includes user IDs of connected clients.
- limit() — Type: usize, Default: 1000. Max occupants per channel (0–1000). Use 0 for counts only (no user details).
- offset() — Type: Option<usize>, Default: None. Zero-based starting index for pagination. Requires limit > 0. Only included when offset > 0.

### Sample code

```
1
  

```

### Returns

here_now() returns HereNowResult:
- total_channels — u32. Total number of channels.
- total_occupancy — u32. Number of all users in the provided channels.
- channels — Vec<HereNowChannel>. One per channel.

HereNowChannel:
- name — String. Channel name.
- occupancy — u32. Number of users in the channel.
- occupants — Vec<HereNowUser>.

HereNowUser:
- user_id — String. ID of the user.
- state — serde_json::Value. User state. If not using default serde, this is Vec<u8>.

## Where now

##### Requires Presence

Presence add-on must be enabled for your key in the Admin Portal. For how to receive presence events, see Presence Events.

Returns the list of channels to which a user ID is currently subscribed.

##### Timeout events

If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

To call where_now(), use the following method in the Rust SDK:

```
`1pubnub  
2    .where_now()  
3    .user_id(String)  
4    .execute()  
`
```

Parameters:
- user_id() — Type: String, Default: User ID from PubNub config. The user ID to get subscriptions for.

### Sample code

```
1
  

```

### Returns

where_now() returns WhereNowResult:
- channels — Vec<String>. Channels where the user ID is present.

## User state

##### Requires Presence

Presence add-on must be enabled for your key in the Admin Portal. For how to receive presence events, see Presence Events.

Set/get key/value pairs (JSON object) specific to a user ID.

##### Presence state format

Presence state must be a JSON object.

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
- user_id() — Type: String, Default: User ID from PubNub config. User ID to set state for.

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
- channels() — Type: Vec<String>, required. Channels to get state of.
- channel_groups() — Type: Vec<String>, required. Channel groups to get state of.
- user_id() — Type: String, Default: User ID from PubNub config. User ID to get state for.

### Sample code

```
1
  

```

### Returns

set_presence_state() returns SetStateResult:
- channel — String. Channel the state was set on.
- state — serde_json::Value. User state. If not using default serde, this is Vec<u8>.

get_presence_state() returns GetStateResult:
- state — Vec<GetStateInfo>.

GetStateInfo:
- channel_name — String. Channel name the state was set on.
- state — serde_json::Value. User state. If not using default serde, this is Vec<u8>.