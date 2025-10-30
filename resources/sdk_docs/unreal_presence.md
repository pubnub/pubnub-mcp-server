# Presence API for Unreal SDK (Condensed)

Presence tracks online/offline users, channel occupancy, and user state. Available via Blueprints or C++.

Requires Presence add-on enabled for your key in the Admin Portal. For events, see Presence Events.

## Setup

- Blueprints: use the Pubnub Subsystem node.
- C++: add dependency to PubnubLibrary in Source/YourProject/YourProject.Build.cs, compile, and use as a Game Instance Subsystem.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

---

## List users from channel - Channel entity

Returns UUIDs currently subscribed and channel occupancy.

Cache: 3 seconds.

### Method(s)

Create a Channel entity and call ListUsersFromChannel:

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->ListUsersFromChannel(  
4    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
5    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
6);  

```

- ListUsersFromChannelResponse (required): Type FOnListUsersFromChannelResponse. Result delegate. Native alternative: FOnListUsersFromChannelResponseNative.
- ListUsersFromChannelSettings: Type FPubnubListUsersFromChannelSettings. Method configuration.

#### FPubnubListUsersFromChannelSettings

- ChannelGroups: FString. Comma-delimited channel group names. Ignored if empty. No wildcards.
- DisableUserID: bool. Whether to disable including user IDs in the response. Default true.
- State: bool. Whether to include client state in the response. Default false.

### Sample code

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

- Result: FPubnubOperationResult. Operation result.
- Data: FPubnubListUsersFromChannelWrapper. Result data.

#### FPubnubListUsersFromChannelWrapper

- Occupancy: int. Number of users in the channel.
- UsersState: TMap<FString, FString>. Map of user IDs and their state.

#### FOnListUsersFromChannelResponseNative

- Result: const FPubnubOperationResult&.
- Data: const FPubnubListUsersFromChannelWrapper&.

### Other examples

#### Return occupancy only

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

---

## List users from channel - PubNub client

Returns UUIDs currently subscribed and channel occupancy.

Cache: 3 seconds.

### Method(s)

```
`1PubnubSubsystem->ListUsersFromChannel(  
2    FString Channel,   
3    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
4    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
5);  
`
```

- Channel (required): FString. Channel name.
- ListUsersFromChannelResponse (required): FOnListUsersFromChannelResponse. Native alternative: FOnListUsersFromChannelResponseNative.
- ListUsersFromChannelSettings: FPubnubListUsersFromChannelSettings.

### Sample code

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

---

## List user subscribed channels

Returns the list of channels a User ID is subscribed to.

Timeout: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1PubnubSubsystem->ListUserSubscribedChannels(  
2    FString UserID,   
3    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
4);  
`
```

- UserID (required): FString. Target user.
- ListUserSubscribedChannelsResponse (required): FOnListUsersSubscribedChannelsResponse.

### Sample code

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

- Result: FPubnubOperationResult.
- Channels: TArray<FString>&. Channel names.

#### FOnListUsersSubscribedChannelsResponseNative

- Result: const FPubnubOperationResult&.
- Channels: const TArray<FString>&.

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

---

## User state

Set/get key/value pairs specific to a subscriber User ID.

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

- Channel (required): FString. Target channel.
- StateJson (required): FString. JSON object for state.
- OnSetStateResponse (required): FOnSetStateResponse. Native alternative: FOnSetStateResponseNative.
- SetStateSettings: FPubnubSetStateSettings.

#### FPubnubSetStateSettings

- ChannelGroups: FString. Comma-delimited channel groups. Ignored if empty.
- UserID: FString. User to set state for. If NULL, uses current context User ID.
- HeartBeat: bool. Whether to set state and issue a /heartbeat call simultaneously.

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

- Channel: FString. Channel to get state of.
- ChannelGroup: FString. Channel group to get state of.
- UserID: FString. Target user.
- OnGetStateResponse (required): FOnGetStateResponse.

### Sample code

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Get State

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

- Result: FPubnubOperationResult.

#### FOnSetStateResponseNative

- Result: const FPubnubOperationResult&.

GetState returns FOnGetStateResponse.

#### FOnGetStateResponse

- Result: FPubnubOperationResult.
- StateResponse: FString. State JSON.

#### FOnGetStateResponseNative

- Result: const FPubnubOperationResult&.
- StateResponse: FString.

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

---

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