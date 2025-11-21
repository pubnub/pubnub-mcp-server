# Presence API for Unreal SDK

Presence tracks who is online/offline and stores custom state:
- Join/leave events per channel
- Channel occupancy
- Channels subscribed per user/device
- User presence state

Learn more in the Presence overview.

You can use PubNub via Blueprints or C++.

In Blueprints, call the Pubnub Subsystem node.

In C++, add a dependency to PubnubLibrary:

In your IDE, navigate to `Source/_{YourProject}_/_{YourProject}_.Build.cs` and add a dependency to `PubnubLibrary`.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run.

In C++, use the SDK as a Game Instance Subsystem.

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

## List users from channel - Channel entity[​](#list-users-from-channel---channel-entity)

Available in entities: Channel

Requires Presence (enable in Admin Portal). Presence Events info.

Returns UUIDs currently subscribed and channel occupancy.

Cache: 3 seconds.

### Method(s)[​](#methods)

Create a Channel entity first.

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->ListUsersFromChannel(  
4    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
5    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
6);  

```

- ListUsersFromChannelResponse Type: FOnListUsersFromChannelResponse. Delegate for the result. You can also use FOnListUsersFromChannelResponseNative for a lambda callback.
- ListUsersFromChannelSettings Type: FPubnubListUsersFromChannelSettings. Method configuration.

#### FPubnubListUsersFromChannelSettings[​](#fpubnublistusersfromchannelsettings)

- ChannelGroups Type: FString. Comma-delimited channel group names. Not used if empty. No wildcards.
- DisableUserID Type: bool. Whether to disable including user IDs in the response. Default true.
- State Type: bool. Whether to include the state of connected clients. Default false.

### Sample code[​](#sample-code)

#### Actor.h[​](#actorh)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp)
  

```
1
  

```

### Returns[​](#returns)

Function is void; delegate returns FOnListUsersFromChannelResponse.

#### FOnListUsersFromChannelResponse[​](#fonlistusersfromchannelresponse)

- Result FPubnubOperationResult. Operation result.
- Data FPubnubListUsersFromChannelWrapper. Result data.

#### FPubnubListUsersFromChannelWrapper[​](#fpubnublistusersfromchannelwrapper)

- Occupancy int. Number of users in the channel.
- UsersState TMap<FString, FString>. Map of user IDs to their state.

#### FOnListUsersFromChannelResponseNative[​](#fonlistusersfromchannelresponsenative)

- Result const FPubnubOperationResult&.
- Data const FPubnubListUsersFromChannelWrapper&.

### Other examples[​](#other-examples)

#### Return occupancy only[​](#return-occupancy-only)

Specify the channel and set DisableUserID to false:

##### Actor.h[​](#actorh-1)

```
1
  

```

##### Actor.cpp[​](#actorcpp-1)

```
1
  

```

#### Use lambda[​](#use-lambda)

##### Actor.h[​](#actorh-2)

```
1
  

```

##### Actor.cpp[​](#actorcpp-2)

```
1
  

```

## List users from channel - PubNub client[​](#list-users-from-channel---pubnub-client)

Requires Presence (enable in Admin Portal). Presence Events info.

Returns UUIDs currently subscribed and channel occupancy.

Cache: 3 seconds.

### Method(s)[​](#methods-1)

```
`1PubnubSubsystem->ListUsersFromChannel(  
2    FString Channel,   
3    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
4    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
5);  
`
```

- Channel Type: FString. Channel to get presence details of.
- ListUsersFromChannelResponse Type: FOnListUsersFromChannelResponse. Delegate for the result. You can also use FOnListUsersFromChannelResponseNative for a lambda callback.
- ListUsersFromChannelSettings Type: FPubnubListUsersFromChannelSettings. Method configuration.

### Sample code[​](#sample-code-1)

#### Actor.h[​](#actorh-3)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-3)
  

```
1
  

```

### Returns[​](#returns-1)

Function is void; delegate returns FOnListUsersFromChannelResponse.

### Other examples[​](#other-examples-1)

#### Return occupancy only[​](#return-occupancy-only-1)

Specify the channel and set DisableUserID to false:

#### Actor.h[​](#actorh-4)

```
1
  

```

#### Actor.cpp[​](#actorcpp-4)

```
1
  

```

#### Use lambda[​](#use-lambda-1)

#### Actor.h[​](#actorh-5)

```
1
  

```

#### Actor.cpp[​](#actorcpp-5)

```
1
  

```

## List user subscribed channels[​](#list-user-subscribed-channels)

Requires Presence (enable in Admin Portal). Presence Events info.

Returns the list of channels a User ID is subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)[​](#methods-2)

```
`1PubnubSubsystem->ListUserSubscribedChannels(  
2    FString UserID,   
3    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
4);  
`
```

- UserID Type: FString. The User ID to query.
- ListUserSubscribedChannelsResponse Type: FOnListUsersSubscribedChannelsResponse. Callback function.

### Sample code[​](#sample-code-2)

#### Actor.h[​](#actorh-6)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-6)
  

```
1
  

```

### Returns[​](#returns-2)

Function is void; delegate returns FOnListUsersSubscribedChannelsResponse.

#### FOnListUsersSubscribedChannelsResponse[​](#fonlistuserssubscribedchannelsresponse)

- Result FPubnubOperationResult. Operation result.
- Channels TArray<FString>&. Channel names the user is subscribed to.

#### FOnListUsersSubscribedChannelsResponseNative[​](#fonlistuserssubscribedchannelsresponsenative)

- Result const FPubnubOperationResult&.
- Channels const TArray<FString>&.

### Other examples[​](#other-examples-2)

#### Use lambda[​](#use-lambda-2)

#### Actor.h[​](#actorh-7)

```
1
  

```

#### Actor.cpp[​](#actorcpp-7)

```
1
  

```

## User state[​](#user-state)

Requires Presence (enable in Admin Portal). Presence Events info.

Set/get key/value pairs specific to a subscriber User ID.

### Method(s)[​](#methods-3)

#### Set state[​](#set-state)

```
`1PubnubSubsystem->SetState(  
2    FString Channel,   
3    FString StateJson,   
4    FOnSetStateResponse OnSetStateResponse,  
5    FPubnubSetStateSettings SetStateSettings = FPubnubSetStateSettings()  
6);  
`
```

- Channel Type: FString. Channel to set state on.
- StateJson Type: FString. JSON object with the state.
- OnSetStateResponse Type: FOnSetStateResponse. Delegate for the result. You can also use FOnSetStateResponseNative for a lambda callback.
- SetStateSettings Type: FPubnubSetStateSettings. Method configuration.

#### FPubnubSetStateSettings[​](#fpubnubsetstatesettings)

- ChannelGroups Type: FString. Comma-delimited channel group names. Not used if empty.
- UserID Type: FString. User ID to set state for. If NULL, uses current context User ID.
- HeartBeat Type: bool. Whether to set state and make a heartbeat call via /heartbeat.

#### Get state[​](#get-state)

```
`1PubnubSubsystem->GetState(  
2    FString Channel,   
3    FString ChannelGroup,   
4    FString UserID,   
5    FOnGetStateResponse OnGetStateResponse  
6);  
`
```

- Channel Type: FString. Channel to get state from.
- ChannelGroup Type: FString. Channel group to get state from.
- UserID Type: FString. User ID to get state of.
- OnGetStateResponse Type: FOnGetStateResponse. Callback function.

### Sample code[​](#sample-code-3)

#### Actor.h[​](#actorh-8)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-8)
  

```
1
  

```

#### Get State[​](#get-state-1)

#### Actor.h[​](#actorh-9)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-9)
  

```
1
  

```

### Returns[​](#returns-3)

SetState returns FOnSetStateResponse.

#### FOnSetStateResponse[​](#fonsetstateresponse)

- Result FPubnubOperationResult.

#### FOnSetStateResponseNative[​](#fonsetstateresponsenative)

- Result const FPubnubOperationResult&.

GetState returns FOnGetStateResponse.

#### FOnGetStateResponse[​](#fongetstateresponse)

- Result FPubnubOperationResult.
- StateResponse FString. The user state.

#### FOnGetStateResponseNative[​](#fongetstateresponsenative)

- Result const FPubnubOperationResult&.
- StateResponse FString.

### Other examples[​](#other-examples-3)

#### Set state with result struct[​](#set-state-with-result-struct)

#### Actor.h[​](#actorh-10)

```
1
  

```

#### Actor.cpp[​](#actorcpp-10)

```
1
  

```

#### Set state for a channel group[​](#set-state-for-a-channel-group)

#### Actor.h[​](#actorh-11)

```
1
  

```

#### Actor.cpp[​](#actorcpp-11)

```
1
  

```

#### Set state with lambda[​](#set-state-with-lambda)

#### Actor.h[​](#actorh-12)

```
1
  

```

#### Actor.cpp[​](#actorcpp-12)

```
1
  

```

#### Get state from channel group[​](#get-state-from-channel-group)

#### Actor.h[​](#actorh-13)

```
1
  

```

#### Actor.cpp[​](#actorcpp-13)

```
1
  

```

#### Get state from channel group with lambda[​](#get-state-from-channel-group-with-lambda)

#### Actor.h[​](#actorh-14)

```
1
  

```

#### Actor.cpp[​](#actorcpp-14)

```
1
  

```

## Complete example[​](#complete-example)

#### ASample_PresenceFull.h[​](#asample_presencefullh)

```
1
  

```

#### ASample_PresenceFull.cpp[​](#asample_presencefullcpp)

```
1
**
```

Last updated on Sep 11, 2025**