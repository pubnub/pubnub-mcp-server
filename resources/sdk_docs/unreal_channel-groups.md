# Channel Groups API for Unreal SDK

Channel groups let you subscribe to many channels via a single group name. You can’t publish to a channel group; publish to individual channels instead.

You can use PubNub via Blueprints or C++.

- Blueprints: Use the Pubnub Subsystem node.
- C++: Add PubnubLibrary dependency and access the subsystem.

Add dependency in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Access PubNub in C++:

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

### Usage in Blueprints and C++

## Add channels to a channel group - ChannelGroup entity

Available in entities: ChannelGroup

Requires Stream Controller add-on (enable in Admin Portal).

Adds a channel to a channel group. Max 200 channels per API call.

### Method(s)

```
1UPubnubChannelGroupEntity* ChannelGroupEntity = PubnubSubsystem->CreateChannelGroupEntity("my-channel-group");  
2
  
3ChannelGroupEntity->AddChannelToGroup(  
4    FString Channel,  
5    FOnAddChannelToGroupResponse OnAddChannelToGroupResponse  
6);  

```

Parameters:
- Channel (FString): Channel to add.
- OnAddChannelToGroupResponse (FOnAddChannelToGroupResponse): Result delegate.
- Optional native callback: FOnAddChannelToGroupResponseNative (lambda).

#### FOnAddChannelToGroupResponse

Field:
- Result (FPubnubOperationResult): Operation result.

#### FOnAddChannelToGroupResponseNative

Field:
- Result (const FPubnubOperationResult&): Operation result.

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

Void; result provided via FOnAddChannelToGroupResponse.

### Other Examples

#### Add channels to a channel group with lambda

Use a lambda to handle the response.

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Add channels to a channel group with result struct

Use the result struct to handle the response.

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## Add channels to a channel group - PubNub client

Requires Stream Controller add-on.

Adds a channel to a channel group. Max 200 channels per API call.

### Method(s)

```
`1PubnubSubsystem->AddChannelToGroup(  
2    FString Channel,   
3    FString ChannelGroup,   
4    FOnAddChannelToGroupResponse OnAddChannelToGroupResponse  
5);  
`
```

Parameters:
- Channel (FString): Channel to add.
- ChannelGroup (FString): Target channel group.
- OnAddChannelToGroupResponse (FOnAddChannelToGroupResponse): Result delegate.
- Optional native callback: FOnAddChannelToGroupResponseNative (lambda).

#### FOnAddChannelToGroupResponse

Field:
- Result (FPubnubOperationResult): Operation result.

#### FOnAddChannelToGroupResponseNative

Field:
- Result (const FPubnubOperationResult&): Operation result.

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

No return value; result via delegate.

### Other Examples

#### Add channels to a channel group with lambda

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

#### Add channels to a channel group with result struct

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## List channels in a channel group - ChannelGroup entity

Available in entities: ChannelGroup

Requires Stream Controller add-on.

Lists all channels in a channel group.

### Method(s)

```
1UPubnubChannelGroupEntity* ChannelGroupEntity = PubnubSubsystem->CreateChannelGroupEntity("my-channel-group");  
2
  
3ChannelGroupEntity->ListChannelsFromGroup(  
4    FOnListChannelsFromGroupResponse OnListChannelsResponse  
5);  

```

Parameters:
- OnListChannelsResponse (FOnListChannelsFromGroupResponse): Result delegate.
- Optional native callback: FOnListChannelsFromGroupResponseNative (lambda).

#### FOnListChannelsFromGroupResponse

Fields:
- Result (FPubnubOperationResult): Operation result.
- Channels (TArray<FString>&): Channel names in the group.

#### FOnListChannelsFromGroupResponseNative

Fields:
- Result (const FPubnubOperationResult&): Operation result.
- Channels (const TArray<FString>&): Channel names in the group.

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

Void; result via FOnListChannelsFromGroupResponse.

### Other Examples

#### List channels from a channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### List channels from a channel group with result struct

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## List channels in a channel group - PubNub client

Requires Stream Controller add-on.

Lists all channels in a channel group.

### Method(s)

```
`1PubnubSubsystem->ListChannelsFromGroup(  
2    FString ChannelGroup,   
3    FOnListChannelsFromGroupResponse OnListChannelsResponse  
4);  
`
```

Parameters:
- ChannelGroup (FString): Group to list.
- OnListChannelsResponse (FOnListChannelsFromGroupResponse): Result delegate.
- Optional native callback: FOnListChannelsFromGroupResponseNative (lambda).

#### FOnListChannelsFromGroupResponse

Fields:
- Result (FPubnubOperationResult): Operation result.
- Channels (TArray<FString>&): Channel names in the group.

#### FOnListChannelsFromGroupResponseNative

Fields:
- Result (const FPubnubOperationResult&): Operation result.
- Channels (const TArray<FString>&): Channel names in the group.

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

Void; result via FOnListChannelsFromGroupResponse.

### Other Examples

#### List channels from a channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## Remove channels from a channel group - ChannelGroup entity

Available in entities: ChannelGroup

Requires Stream Controller add-on.

Removes channels from a channel group.

### Method(s)

```
1UPubnubChannelGroupEntity* ChannelGroupEntity = PubnubSubsystem->CreateChannelGroupEntity("my-channel-group");  
2
  
3ChannelGroupEntity->RemoveChannelFromGroup(  
4    FString Channel,  
5    FOnRemoveChannelFromGroupResponse OnRemoveChannelFromGroupResponse  
6);  

```

Parameters:
- Channel (FString): Channel to remove.
- OnRemoveChannelFromGroupResponse (FOnRemoveChannelFromGroupResponse): Result delegate.
- Optional native callback: FOnRemoveChannelFromGroupResponseNative (lambda).

#### FOnRemoveChannelFromGroupResponse

Field:
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelFromGroupResponseNative

Field:
- Result (const FPubnubOperationResult&): Operation result.

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

Void; result via FOnRemoveChannelFromGroupResponse.

### Other Examples

#### Remove channels from a channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Remove channels from a channel group with result struct

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## Remove channels from a channel group - PubNub client

Requires Stream Controller add-on.

Removes channels from a channel group.

### Method(s)

```
`1PubnubSubsystem->RemoveChannelFromGroup(  
2    FString Channel,   
3    FString ChannelGroup,   
4    FOnRemoveChannelFromGroupResponse OnRemoveChannelFromGroupResponse  
5);  
`
```

Parameters:
- ChannelGroup (FString): Group to remove from.
- Channel (FString): Channel to remove.
- OnRemoveChannelFromGroupResponse (FOnRemoveChannelFromGroupResponse): Result delegate.
- Optional native callback: FOnRemoveChannelFromGroupResponseNative (lambda).

#### FOnRemoveChannelFromGroupResponse

Field:
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelFromGroupResponseNative

Field:
- Result (const FPubnubOperationResult&): Operation result.

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

No return value; result via delegate.

### Other Examples

#### Remove channels from a channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Remove channels from a channel group with result struct

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## Delete a channel group - ChannelGroup entity

Available in entities: ChannelGroup

Requires Stream Controller add-on.

Removes a channel group.

### Method(s)

```
1UPubnubChannelGroupEntity* ChannelGroupEntity = PubnubSubsystem->CreateChannelGroupEntity("my-channel-group");  
2
  
3ChannelGroupEntity->RemoveChannelGroup(  
4    FOnRemoveChannelGroupResponse OnRemoveChannelGroupResponse  
5);  

```

Parameters:
- OnRemoveChannelGroupResponse (FOnRemoveChannelGroupResponse): Result delegate.
- Optional native callback: FOnRemoveChannelGroupResponseNative (lambda).

#### FOnRemoveChannelGroupResponse

Field:
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelGroupResponseNative

Field:
- Result (const FPubnubOperationResult&): Operation result.

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

Void; result via FOnRemoveChannelGroupResponse.

### Other Examples

#### Delete a channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Delete a channel group with result struct

##### Actor.h

```
1
  

```

##### Actor.cpp

```
1
  

```

## Delete a channel group - PubNub client

Requires Stream Controller add-on.

Removes a channel group.

### Method(s)

```
`1PubnubSubsystem->RemoveChannelGroup(  
2    FString ChannelGroup,   
3    FOnRemoveChannelGroupResponse OnRemoveChannelGroupResponse  
4);  
`
```

Parameters:
- ChannelGroup (FString): Group to remove.
- OnRemoveChannelGroupResponse (FOnRemoveChannelGroupResponse): Result delegate.
- Optional native callback: FOnRemoveChannelGroupResponseNative (lambda).

#### FOnRemoveChannelGroupResponse

Field:
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelGroupResponseNative

Field:
- Result (const FPubnubOperationResult&): Operation result.

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

No return value; result via delegate.

### Other Examples

#### Delete a channel group with lambda

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Delete a channel group with result struct

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## Complete example

#### ASample_GroupsFull.h

```
1
  

```

#### ASample_GroupsFull.cpp

```
1
**
```
Last updated on Sep 11, 2025**