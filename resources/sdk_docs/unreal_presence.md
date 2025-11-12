# Presence API for Unreal SDK

Presence tracks online/offline users and custom state:
- Joins/leaves per channel
- Occupancy (user count) per channel
- Channels a user/device is subscribed to
- Presence state per user

Requires Presence add-on to be enabled for your key in the Admin Portal. See Presence Events for event subscription details.

You can use the SDK via Blueprints (Pubnub Subsystem node) or C++.

Add C++ dependency in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access the subsystem in C++:

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

## List users from channel - Channel entity

Available in entities: Channel

Requires Presence. Returns current channel state: UUIDs subscribed and total occupancy. Cache: 3 seconds.

### Method(s)

Create a Channel entity for the target channel:

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->ListUsersFromChannel(  
4    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
5    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
6);  

```

- ListUsersFromChannelResponse
  - Type: FOnListUsersFromChannelResponse
  - Delegate for the result. Or use native callback FOnListUsersFromChannelResponseNative (lambda).
- ListUsersFromChannelSettings
  - Type: FPubnubListUsersFromChannelSettings
  - Method configuration.

#### FPubnubListUsersFromChannelSettings

- ChannelGroups
  - Type: FString
  - Comma-delimited channel group names. Not used if empty. No wildcards.
- DisableUserID
  - Type: bool
  - Whether to disable including user IDs in the response. Default true.
- State
  - Type: bool
  - Whether to include connected clients’ state. Default false.

### Sample code

- C++

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

### Returns

Void. Delegate returns FOnListUsersFromChannelResponse.

#### FOnListUsersFromChannelResponse

- Result: FPubnubOperationResult
- Data: FPubnubListUsersFromChannelWrapper

#### FPubnubListUsersFromChannelWrapper

- Occupancy: int
- UsersState: TMap<FString, FString> (user ID -> state)

#### FOnListUsersFromChannelResponseNative

- Result: const FPubnubOperationResult&
- Data: const FPubnubListUsersFromChannelWrapper&

### Other examples

#### Return occupancy only

Specify the channel and set DisableUserID to false.

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Use lambda

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## List users from channel - PubNub client

Requires Presence. Returns current channel state (UUID list and occupancy). Cache: 3 seconds.

### Method(s)

```
`1PubnubSubsystem->ListUsersFromChannel(  
2    FString Channel,   
3    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
4    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
5);  
`
```

- Channel
  - Type: FString
  - Channel to get presence details of.
- ListUsersFromChannelResponse
  - Type: FOnListUsersFromChannelResponse
  - Delegate for the result. Or use native FOnListUsersFromChannelResponseNative (lambda).
- ListUsersFromChannelSettings
  - Type: FPubnubListUsersFromChannelSettings

### Sample code

- C++
- Blueprint

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

### Returns

Void. Delegate returns FOnListUsersFromChannelResponse.

### Other examples

#### Return occupancy only

Specify the channel and set DisableUserID to false.

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Use lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## List user subscribed channels

Requires Presence. Returns channels a User ID is subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1PubnubSubsystem->ListUserSubscribedChannels(  
2    FString UserID,   
3    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
4);  
`
```

- UserID
  - Type: FString
  - User ID to query.
- ListUserSubscribedChannelsResponse
  - Type: FOnListUsersSubscribedChannelsResponse
  - Callback for the result.

### Sample code

- C++
- Blueprint

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

### Returns

Void. Delegate returns FOnListUsersSubscribedChannelsResponse.

#### FOnListUsersSubscribedChannelsResponse

- Result: FPubnubOperationResult
- Channels: TArray<FString>&

#### FOnListUsersSubscribedChannelsResponseNative

- Result: const FPubnubOperationResult&
- Channels: const TArray<FString>&

### Other examples

#### Use lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## User state

Requires Presence. Set/get key/value pairs per subscriber User ID.

### Method(s)

#### Set state

```
`1PubnubSubsystem->SetState(  
2    FString Channel,   
3    FString StateJson,   
4    FOnSetStateResponse OnSetStateResponse,  
5    FPubnubSetStateSettings SetStateSettings = FPubnubSetStateSettings()  
6);  
`
```

- Channel
  - Type: FString
  - Channel to set presence state on.
- StateJson
  - Type: FString
  - JSON object to set as state.
- OnSetStateResponse
  - Type: FOnSetStateResponse
  - Delegate for the result. Or use native FOnSetStateResponseNative (lambda).
- SetStateSettings
  - Type: FPubnubSetStateSettings

#### FPubnubSetStateSettings

- ChannelGroups
  - Type: FString
  - Comma-delimited channel group names. Not used if empty.
- UserID
  - Type: FString
  - User ID to set state for. If NULL, uses current context User ID.
- HeartBeat
  - Type: bool
  - Whether to set state and make a heartbeat call via /heartbeat.

#### Get state

```
`1PubnubSubsystem->GetState(  
2    FString Channel,   
3    FString ChannelGroup,   
4    FString UserID,   
5    FOnGetStateResponse OnGetStateResponse  
6);  
`
```

- Channel
  - Type: FString
  - Channel to get presence state of.
- ChannelGroup
  - Type: FString
  - Channel group to get presence state of.
- UserID
  - Type: FString
  - User ID to get presence state of.
- OnGetStateResponse
  - Type: FOnGetStateResponse
  - Callback for the result.

### Sample code

- C++
- Blueprint

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Get State

- C++
- Blueprint

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

### Returns

SetState returns FOnSetStateResponse.

#### FOnSetStateResponse

- Result: FPubnubOperationResult

#### FOnSetStateResponseNative

- Result: const FPubnubOperationResult&

GetState returns FOnGetStateResponse.

#### FOnGetStateResponse

- Result: FPubnubOperationResult
- StateResponse: FString

#### FOnGetStateResponseNative

- Result: const FPubnubOperationResult&
- StateResponse: FString

### Other examples

#### Set state with result struct

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Set state for a channel group

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Set state with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Get state from channel group

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Get state from channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## Complete example

#### ASample_PresenceFull.h

```
1
  

```

#### ASample_PresenceFull.cpp

```
1
**
```

Last updated on Sep 11, 2025**