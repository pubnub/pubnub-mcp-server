# Presence API for Unreal SDK

Presence tracks online/offline status, occupancy, subscriptions, and user presence state.

- Use via Blueprints (Pubnub Subsystem node) or C++.
- Requires Presence add-on enabled in Admin Portal.
- Presence Events: see Presence overview and Presence Events docs.

## Setup (C++)

Add dependency to PubnubLibrary in Source/YourProject/YourProject.Build.cs and compile:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access the subsystem:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example call:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

---

## List users from channel - Channel entity

Requires Presence. Returns UUIDs currently subscribed and total occupancy. Cache: 3 seconds.

### Method(s)

Create a Channel entity first:

```
1UPubnubChannelEntity* ChannelEntity = PubnubSubsystem->CreateChannelEntity("my-channel");  
2
  
3ChannelEntity->ListUsersFromChannel(  
4    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
5    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
6);  

```

Parameters:
- ListUsersFromChannelResponse: Type FOnListUsersFromChannelResponse. Delegate for the result. You can also use a native callback FOnListUsersFromChannelResponseNative.
- ListUsersFromChannelSettings: Type FPubnubListUsersFromChannelSettings. Method configuration.

#### FPubnubListUsersFromChannelSettings

- ChannelGroups: Type FString. Comma-delimited channel group names. Not used if empty. Wildcards not supported.
- DisableUserID: Type bool. Whether to disable including user IDs in the response. Default true.
- State: Type bool. Whether to include state of connected clients. Default false.

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

The function is void; the delegate returns FOnListUsersFromChannelResponse.

#### FOnListUsersFromChannelResponse

- Result: FPubnubOperationResult. Operation result.
- Data: FPubnubListUsersFromChannelWrapper. Result data.

#### FPubnubListUsersFromChannelWrapper

- Occupancy: int. Number of users on the channel.
- UsersState: TMap<FString, FString>. Map of user IDs and their state.

#### FOnListUsersFromChannelResponseNative

- Result: const FPubnubOperationResult&.
- Data: const FPubnubListUsersFromChannelWrapper&.

### Other examples

#### Return occupancy only

Specify the channel and set DisableUserID to false:

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

---

## List users from channel - PubNub client

Requires Presence. Returns UUIDs currently subscribed and total occupancy. Cache: 3 seconds.

### Method(s)

```
`1PubnubSubsystem->ListUsersFromChannel(  
2    FString Channel,   
3    FOnListUsersFromChannelResponse ListUsersFromChannelResponse,   
4    FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings = FPubnubListUsersFromChannelSettings()  
5);  
`
```

Parameters:
- Channel: Type FString. Channel to get presence details of.
- ListUsersFromChannelResponse: Type FOnListUsersFromChannelResponse. Delegate for the result. You can also use FOnListUsersFromChannelResponseNative.
- ListUsersFromChannelSettings: Type FPubnubListUsersFromChannelSettings.

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

Void; the delegate returns FOnListUsersFromChannelResponse.

### Other examples

#### Return occupancy only

Set DisableUserID to false:

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

Requires Presence. Returns list of channels a User ID is subscribed to.

Timeout events: If the app restarts within the heartbeat window, no timeout event is generated.

### Method(s)

```
`1PubnubSubsystem->ListUserSubscribedChannels(  
2    FString UserID,   
3    FOnListUsersSubscribedChannelsResponse ListUserSubscribedChannelsResponse  
4);  
`
```

Parameters:
- UserID: Type FString. User ID to query.
- ListUserSubscribedChannelsResponse: Type FOnListUsersSubscribedChannelsResponse. Callback function.

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

Void; the delegate returns FOnListUsersSubscribedChannelsResponse.

#### FOnListUsersSubscribedChannelsResponse

- Result: FPubnubOperationResult.
- Channels: TArray<FString>&. Channel names the user is subscribed to.

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

Requires Presence. Set/get key/value pairs specific to a subscriber User ID.

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

Parameters:
- Channel: Type FString. Channel to set presence state on.
- StateJson: Type FString. JSON object with state to set.
- OnSetStateResponse: Type FOnSetStateResponse. Delegate for result. You can also use FOnSetStateResponseNative.
- SetStateSettings: Type FPubnubSetStateSettings.

#### FPubnubSetStateSettings

- ChannelGroups: Type FString. Comma-delimited channel group names. Not used if empty.
- UserID: Type FString. User ID to set state for. If NULL, uses current context User ID.
- HeartBeat: Type bool. Whether to set state and make a heartbeat call via /heartbeat.

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

Parameters:
- Channel: Type FString. Channel to get state of.
- ChannelGroup: Type FString. Channel group to get state of.
- UserID: Type FString. User ID to get state of.
- OnGetStateResponse: Type FOnGetStateResponse. Callback function.

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
- StateResponse: FString. The user state.

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
Last updated on Sep 11, 2025**