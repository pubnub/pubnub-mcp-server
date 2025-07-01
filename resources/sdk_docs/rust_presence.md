# Presence API – Rust SDK

Presence lets you query real-time occupancy and manage per-user state.  
Feature flag: `fullpresence` (enable in Admin Portal).  

---

## Here Now

3 s response cache.

### Method
```rust
`pubnub  
    .here_now()  
    .channels(VecString>)  
    .channel_groups(VecString>)  
    .include_state(bool)  
    .include_user_ids(bool)  
    .execute()  
`
```

Parameters  
• `channels(Vec<String>)` – target channels  
• `channel_groups(Vec<String>)` – target groups  
• `include_state(bool, default false)` – include user state  
• `include_user_ids(bool, default true)` – include user IDs  

### Returns

HereNowResult  
• `total_channels: u32`  
• `total_occupancy: u32`  
• `channels: Vec<HereNowChannel>`  

HereNowChannel  
• `name: String`  
• `occupancy: u32`  
• `occupants: Vec<HereNowUser>`  

HereNowUser  
• `user_id: String`  
• `state: serde_json::Value | Vec<u8>`  

### Basic Usage
```
`  
`
```

---

## Where Now

### Method
```rust
`pubnub  
    .where_now()  
    .user_id(String)  
    .execute()  
`
```

Parameter  
• `user_id(String)` – user to inspect (defaults to config value)  

### Returns

WhereNowResult  
• `channels: Vec<String>`

### Basic Usage
```
`  
`
```

---

## User State

Presence state is a JSON object.

### Set State
```rust
`pubnub  
    .set_presence_state(T: Serialize)  
    .channels(VecString>)  
    .channel_groups(VecString>)  
    .user_id(String)  
    .execute()  
`
```

### Get State
```rust
`pubnub  
    .get_presence_state()  
    .channels(VecString>)  
    .channel_groups(VecString>)  
    .user_id(String)  
    .execute()  
`
```

Shared parameters  
• `channels(Vec<String>)` – target channels  
• `channel_groups(Vec<String>)` – target groups  
• `user_id(String)` – user to set/get state (defaults to config)  
• `set_presence_state(T)` – JSON state to set (Set only)

### Returns

SetStateResult  
• `channel: String` – channel affected  
• `state: serde_json::Value | Vec<u8>`  

GetStateResult  
• `state: Vec<GetStateInfo>`  

GetStateInfo  
• `channel_name: String`  
• `state: serde_json::Value | Vec<u8>`  

### Basic Usage
```
`  
`
```

_Last updated: Jun 16 2025_