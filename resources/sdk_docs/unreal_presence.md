On this page
# Presence API for Unreal SDK

Presence enables you to track the online and offline status of users and devices in real time and store custom state information. Presence provides authoritative information on:

- When a user has joined or left a channel

- Who, and how many, users are subscribed to a particular channel

- Which channel(s) an individual user is subscribed to

- Associated state information for these users

Learn more about our Presence feature [here](/docs/general/presence/overview).

### Usage in Blueprints and C++

## List Users from Channel[​](#list-users-from-channel)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current state of a channel including a list of unique user-ids currently subscribed to the channel and the total occupancy count.

##### Cache

This method has a 3 second response cache time.

### Method(s)[​](#methods)

- Blueprint
- C++

```
`PubnubSubsystem->ListUsersFromChannel(  
    FString Channel,   
    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to get the presence details of.`ListUsersFromChannelResponse` *Type: [`FOnListUsersFromChannelResponse`](#fonlistusersfromchannelresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.`ListUsersFromChannelSettings`Type: [`FPubnubListUsersFromChannelSettings`](#fpubnublistusersfromchannelsettings)A struct defining the method's configuration.
#### FPubnubListUsersFromChannelSettings[​](#fpubnublistusersfromchannelsettings)
  
*  requiredParameterDescription`ChannelGroups`Type: `FString`Comma-delimited list of channel group names. Not used if `NULL`.`DisableUserID`Type: boolWhether to disable including the user IDs of the connected clients in the response. Default is `true`.`State`Type: boolWhether to including the state of the connected clients in the response. Default is `false`.

### Basic Usage[​](#basic-usage)

#### Get a list of User IDs subscribed to channel[​](#get-a-list-of-user-ids-subscribed-to-channel)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### MyGameMode.h[​](#mygamemodeh)

```
`// NOTE: This example requires correct PubnubSDK configuration in plugins settings and adding "PubnubLibrary" to PublicDependencyModuleNames in your build.cs  
// More info in the documentation: https://www.pubnub.com/docs/sdks/unreal/api-reference/configuration  
  
#pragma once  
  
#include "CoreMinimal.h"  
#include "GameFramework/GameModeBase.h"  
#include "MyGameMode.generated.h"  
  
/**  
 *   
 */  
UCLASS()  
//Replace MYPROJECT with name of your project  
class MYPROJECT_API AMyGameMode : public AGameModeBase  
`
```
show all 24 lines

#### MyGameMode.cpp[​](#mygamemodecpp)

```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::ListUsersFromChannelExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
  
`
```
show all 40 lines

### Returns[​](#returns)

This method returns the [`FOnListUsersFromChannelResponse`](#fonlistusersfromchannelresponse) struct.

#### FOnListUsersFromChannelResponse[​](#fonlistusersfromchannelresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`Message``FString`More information about the status of the operation.`Data`[`FPubnubListUsersFromChannelWrapper`](#fpubnublistusersfromchannelwrapper)A struct containing the result of the operation.

#### FPubnubListUsersFromChannelWrapper[​](#fpubnublistusersfromchannelwrapper)

  

FieldTypeDescription`Occupancy``int`The number of users in a given channel.`UuidsState``TMap<FString, FString>`A map of user IDs and their respective [state](#user-state).

#### JSON response[​](#json-response)

```
`{  
  "status": 200,   
  "message": "OK",   
  "occupancy": 2,   
  "uuids": [  
    {"uuid": "uuid-1"},   
    {"uuid": "uuid-2"}  
  ],   
  "service": "Presence"  
}  
`
```

### Other Examples[​](#other-examples)

#### Return Occupancy Only[​](#return-occupancy-only)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can return only the `occupancy` information for a single channel by specifying the channel and setting `DisableUserID` to `false`:

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FPubnubListUsersFromChannelSettings ListUsersFromChannelResponse;  
ListUsersFromChannelResponse.BindDynamic(this, &AMyActor::ListUsersFromChannelResponse);  
  
// Create the list users settings  
FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings;  
`
```
show all 21 lines

## List User Subscribed Channels[​](#list-user-subscribed-channels)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

You can obtain information about the current list of channels to which a User ID is subscribed to.

##### Timeout events

If the app is killed/crashes and restarted (or the page containing the PubNub instance is refreshed on the browser) within the heartbeat window no timeout event is generated.

### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->ListUserSubscribedChannels(  
    FString UserID,   
    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
);  
`
```
*  requiredParameterDescription`UserID` *Type: `FString`The User ID to get the subscribed channels of.`ListUserSubscribedChannelsResponse` *Type: `FOnListUsersSubscribedChannelsResponse`The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

### Basic Usage[​](#basic-usage-1)

You simply need to define the user ID and the `callback` function to be used to send the data to as in the example below.

#### Get a list of channels a User is subscribed to[​](#get-a-list-of-channels-a-user-is-subscribed-to)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString UserId = "myUserId";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnListUsersSubscribedChannelsResponse ListUsersFromChannelResponse;  
ListUserSubscribedChannelsResponse.BindDynamic(this, &AMyActor::OnListUsersFromChannelResponse);  
  
// List users from the channel using the specified settings  
PubnubSubsystem->ListUserSubscribedChannels(UserId, ListUserSubscribedChannelsResponse);  
`
```

### Returns[​](#returns-1)

This method returns the [`FOnListUsersSubscribedChannelsResponse`](#fonlistuserssubscribedchannelsresponse) struct.

#### FOnListUsersSubscribedChannelsResponse[​](#fonlistuserssubscribedchannelsresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`Message``FString`More information about the status of the operation.`Channels``TArray<FString>&`An array of channel names the user is subscribed to.

#### JSON response[​](#json-response-1)

```
`{  
  "status": 200,   
  "message": "OK",   
  "payload": {  
    "channels": ["my_channel"]  
  },   
  "service": "Presence"  
}  
`
```

## User State[​](#user-state)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

The Presence API is used to set/get key/value pairs specific to a subscriber User ID.

### Method(s)[​](#methods-2)

#### Set State[​](#set-state)

- Blueprint
- C++

```
`PubnubSubsystem->SetState(  
    FString Channel,   
    FString StateJson,   
    FPubnubSetStateSettings SetStateSettings = FPubnubSetStateSettings()  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to set the presence state on.`StateJson` *Type: `FString`JSON object with the state to set.`SetStateSettings`Type: [`FPubnubSetStateSettings`](#fpubnubsetstatesettings)Struct defining the method's configuration.
#### FPubnubSetStateSettings[​](#fpubnubsetstatesettings)
  
*  requiredParameterDescription`ChannelGroups`Type: `FString`Comma-delimited list of channel group names. Not used if `NULL`.`UserID`Type: `FString`The User ID of the user for which to set state for. If `NULL`, the current PubNub context User ID is used.`HeartBeat`Type: boolWhether to set the state and make a heartbeat call at the same time via the `/heartbeat` endpoint.

#### Get State[​](#get-state)

- Blueprint
- C++

```
`PubnubSubsystem->GetState(  
    FString Channel,   
    FString ChannelGroup,   
    FString UserID,   
    FOnPubnubResponse OnGetStateResponse  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to get the presence state of.`ChannelGroup` *Type: `FString`The channel group to get the presence state of.`UserID` *Type: `FString`The User ID to get the presence state of.`OnGetStateResponse` *Type: `FOnPubnubResponse`The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

### Basic Usage[​](#basic-usage-2)

#### Set State[​](#set-state-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "exampleChannel";  
FString StateJson = "{\"mood\": \"happy\"}";   
  
// Create the set state settings  
FPubnubSetStateSettings SetStateSettings;  
SetStateSettings.ChannelGroups = "group1,group2"; // Example channel groups  
SetStateSettings.UserID = "user123"; // Example user ID  
SetStateSettings.HeartBeat = true; // Set state and make a heartbeat call  
  
`
```
show all 17 lines

#### Get State[​](#get-state-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "exampleChannel";  
FString ChannelGroup = "";  
FString UserID = "user123";  
  
// Create the response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnGetStateResponse;  
OnGetStateResponse.BindDynamic(this, &AMyActor::OnGetStateResponse);  
  
`
```
show all 17 lines

### Returns[​](#returns-2)

The `SetState` method doesn't have a return value. The `GetState` method returns the following:

```
`{  
  "status": 200,   
  "message": "OK",   
  "payload": {  
    "happy": "true"  
  },   
  "service": "Presence"  
}  
`
```

## Heartbeat[​](#heartbeat)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

This method notifies channels and channel groups about a client's presence. You can send heartbeats to channels you are not subscribed to.

### Method(s)[​](#methods-3)

- Blueprint
- C++

```
`PubnubSubsystem->Heartbeat(  
    FString Channel,   
    FString ChannelGroup  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to send the heartbeat to.`ChannelGroup` *Type: `FString`The channel group to send the heartbeat to.

### Basic Usage[​](#basic-usage-3)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "exampleChannel";  
FString ChannelGroup = "exampleGroup";  
  
// Send the heartbeat to the specified channel and channel group  
PubnubSubsystem->Heartbeat(Channel, ChannelGroup);  
`
```

### Returns[​](#returns-3)

This method doesn't have a return value
Last updated on **Jun 16, 2025**