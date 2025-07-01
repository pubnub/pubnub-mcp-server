On this page
# Presence API for Rust SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

### Available in features
fullpresence

## Here Now[​](#here-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user IDs currently subscribed to the channel and the total occupancy count of the channel by calling the `here_now()` function in your application.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

To call `here_now()`, use the following method in the Rust SDK:

```
`pubnub  
    .here_now()  
    .channels(VecString>)  
    .channel_groups(VecString>)  
    .include_state(bool)  
    .include_user_ids(bool)  
    .execute()  
`
```

*  requiredParameterDescription`channels()`Type: `Vec<String>`Default:  
n/aThe channels to get the details of.`channel_groups()`Type: `Vec<String>`Default:  
n/aThe channel groups to get the details of.`include_state()`Type: `bool`Default:  
`false`If `true`, the response will include the presence states of the users for `channels`/`channelGroups`.`include_user_ids()`Type: `bool`Default:  
`true`If true, the response will include the user IDs of the connected clients.

### Basic Usage[​](#basic-usage)

#### Get a list of channels, their occupancy, and individual occupants' states[​](#get-a-list-of-channels-their-occupancy-and-individual-occupants-states)

```
`  
`
```

### Returns[​](#returns)

The `here_now()` operation returns a `HereNowResult`, which contains the following fields:

FieldTypeDescription`total_channels``u32`Total number of channels.`total_occupancy``u32`Number of all users in the provided channels.`channels``Vec<HereNowChannel>`A vector with values of `HereNowChannel` for each channel. Refer to [HereNowChannel](#herenowchannel) for more details.

#### HereNowChannel[​](#herenowchannel)

FieldTypeDescription`name``String`Channel name.`occupancy``u32`Number of all users in the channel.`occupants``Vec<HereNowUser>`A vector of `HereNowUser`, refer to [HereNowUser](#herenowuser) for more details.

#### HereNowUser[​](#herenowuser)

FieldTypeDescription`user_id``String`Id of the user.`state``serde_json::Value`State of the user. If you're not using the default `serde` serialization framework, this field is of type `Vec<u8>`.

## Where Now[​](#where-now)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a user ID is subscribed to by calling the `where_now()` function in your application.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

To call `where_now()`, use the following method in the Rust SDK:

```
`pubnub  
    .where_now()  
    .user_id(String)  
    .execute()  
`
```

*  requiredParameterDescription`user_id()`Type: `String`Default:  
User ID provided in PubNub configUser ID to get the current channel subscriptions for.

### Basic Usage[​](#basic-usage-1)

```
`  
`
```

### Returns[​](#returns-1)

The `where_now()` operation returns a `WhereNowResult`, which contains the following fields:

FieldTypeDescription`channels``Vec<String>`List of channels where the user ID is present.

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

The state API is used to set/get key/value pairs specific to a subscriber user ID.

State information is supplied as a JSON object of key/value pairs.

##### Presence state format

Presence state must be expressed as a JSON object.

### Method(s)[​](#methods-2)

To manage presence state, use any of the following method(s) in the Rust SDK:

#### Set State[​](#set-state)

```
`pubnub  
    .set_presence_state(T: Serialize)  
    .channels(VecString>)  
    .channel_groups(VecString>)  
    .user_id(String)  
    .execute()  
`
```

*  requiredParameterDescription`set_presence_state()` *Type: `T: Serialize`Default:  
n/aThe state to set expressed as a JSON object.`channels()`Type: `Vec<String>`Default:  
n/aChannels to set state on.`channel_groups()`Type: `Vec<String>`Default:  
n/aChannel groups to set state on.`user_id()`Type: `String`Default:  
User ID provided in PubNub configThe user ID to set state for.

#### Get State[​](#get-state)

```
`pubnub  
    .get_presence_state()  
    .channels(VecString>)  
    .channel_groups(VecString>)  
    .user_id(String)  
    .execute()  
`
```

*  requiredParameterDescription`channels()`Type: `Vec<String>`Default:  
n/aChannels to get state of.`channel_groups()`Type: `Vec<String>`Default:  
n/aChannel groups to set state of.`user_id()`Type: `String`Default:  
User ID provided in PubNub configThe user ID to get state for.

### Basic Usage[​](#basic-usage-2)

```
`  
`
```

### Returns[​](#returns-2)

The `set_presence_state()` operation returns a `SetStateResult` which contains the following fields:

FieldTypeDescription`channel``String`The channel the state was set on.`state``serde_json::Value`State of the user. If you're not using the default `serde` serialization framework, this field is of type `Vec<u8>`.

The `get_presence_state()` operation returns a `GetStateResult` which contains the following fields:

FieldTypeDescription`state``Vec<GetStateInfo>`Vector of [`GetStateInfo`](#getstateinfo) objects.

#### GetStateInfo[​](#getstateinfo)

The `GetStateInfo` object contains the following fields:

FieldTypeDescription`channel_name``String`The channel name the state was set on.`state``serde_json::Value`State of the user. If you're not using the default `serde` serialization framework, this field is of type `Vec<u8>`.Last updated on **Jun 16, 2025**