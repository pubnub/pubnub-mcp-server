# Channel Groups API for Unreal SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) let you subscribe to a named collection of [channels](/docs/general/channels/overview). You can't publish to a channel group—publish to individual channels instead.

You can use the SDK via Blueprints or in C++.

- Blueprints: Use the Pubnub Subsystem node.
- C++: Add dependency to PubnubLibrary and access via Game Instance Subsystem.

Add `PubnubLibrary` dependency in `Source/YourProject/YourProject.Build.cs`:

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

## Add channels to a channel group - ChannelGroup entity[​](#add-channels-to-a-channel-group---channelgroup-entity)

Available in entities: ChannelGroup

Requires Stream Controller add-on (enable in the Admin Portal).

Adds a channel to a channel group. Maximum 200 channels per API call.

### Method(s)[​](#methods)

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
- OnAddChannelToGroupResponse (FOnAddChannelToGroupResponse): Result delegate. Or use FOnAddChannelToGroupResponseNative with a lambda.

#### FOnAddChannelToGroupResponse[​](#fonaddchanneltogroupresponse)
- Result (FPubnubOperationResult): Operation result.

#### FOnAddChannelToGroupResponseNative[​](#fonaddchanneltogroupresponsenative)
- Result (const FPubnubOperationResult&): Operation result.

### Sample code[​](#sample-code)

- C++

#### Actor.h[​](#actorh)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp)
  

```
1
  

```

### Returns[​](#returns)

Void. Delegate returns FOnAddChannelToGroupResponse.

### Other Examples[​](#other-examples)

#### Add channels to a channel group with lambda[​](#add-channels-to-a-channel-group-with-lambda)

Use a lambda to handle the response.

#### Actor.h[​](#actorh-1)

```
1
  

```

#### Actor.cpp[​](#actorcpp-1)

```
1
  

```

#### Add channels to a channel group with result struct[​](#add-channels-to-a-channel-group-with-result-struct)

Use the result struct to handle the response.

##### Actor.h[​](#actorh-2)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-2)

  

```
1
  

```

## Add channels to a channel group - PubNub client[​](#add-channels-to-a-channel-group---pubnub-client)

Requires Stream Controller add-on (enable in the Admin Portal).

Adds a channel to a channel group. Maximum 200 channels per API call.

### Method(s)[​](#methods-1)

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
- OnAddChannelToGroupResponse (FOnAddChannelToGroupResponse): Result delegate. Or use FOnAddChannelToGroupResponseNative with a lambda.

#### FOnAddChannelToGroupResponse[​](#fonaddchanneltogroupresponse-1)
- Result (FPubnubOperationResult): Operation result.

#### FOnAddChannelToGroupResponseNative[​](#fonaddchanneltogroupresponsenative-1)
- Result (const FPubnubOperationResult&): Operation result.

### Sample code[​](#sample-code-1)

- C++
- Blueprint

#### Actor.h[​](#actorh-3)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-3)
  

```
1
  

```

### Returns[​](#returns-1)

No return value.

### Other Examples[​](#other-examples-1)

#### Add channels to a channel group with lambda[​](#add-channels-to-a-channel-group-with-lambda-1)

##### Actor.h[​](#actorh-4)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-4)

  

```
1
  

```

#### Add channels to a channel group with result struct[​](#add-channels-to-a-channel-group-with-result-struct-1)

##### Actor.h[​](#actorh-5)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-5)

  

```
1
  

```

## List channels in a channel group - ChannelGroup entity[​](#list-channels-in-a-channel-group---channelgroup-entity)

Available in entities: ChannelGroup

Requires Stream Controller add-on (enable in the Admin Portal).

Lists all channels in a channel group.

### Method(s)[​](#methods-2)

```
1UPubnubChannelGroupEntity* ChannelGroupEntity = PubnubSubsystem->CreateChannelGroupEntity("my-channel-group");  
2
  
3ChannelGroupEntity->ListChannelsFromGroup(  
4    FOnListChannelsFromGroupResponse OnListChannelsResponse  
5);  

```

Parameters:
- OnListChannelsResponse (FOnListChannelsFromGroupResponse): Result delegate. Or use FOnListChannelsFromGroupResponseNative with a lambda.

#### FOnListChannelsFromGroupResponse[​](#fonlistchannelsfromgroupresponse)
- Result (FPubnubOperationResult): Operation result.
- Channels (TArray<FString>&): Channel names.

#### FOnListChannelsFromGroupResponseNative[​](#fonlistchannelsfromgroupresponsenative)
- Result (const FPubnubOperationResult&): Operation result.
- Channels (const TArray<FString>&): Channel names.

### Sample code[​](#sample-code-2)

- C++

#### Actor.h[​](#actorh-6)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-6)
  

```
1
  

```

### Returns[​](#returns-2)

Void. Delegate returns FOnListChannelsFromGroupResponse.

### Other Examples[​](#other-examples-2)

#### List channels from a channel group with lambda[​](#list-channels-from-a-channel-group-with-lambda)

#### Actor.h[​](#actorh-7)

```
1
  

```

#### Actor.cpp[​](#actorcpp-7)

```
1
  

```

#### List channels from a channel group with result struct[​](#list-channels-from-a-channel-group-with-result-struct)

##### Actor.h[​](#actorh-8)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-8)

  

```
1
  

```

## List channels in a channel group - PubNub client[​](#list-channels-in-a-channel-group---pubnub-client)

Requires Stream Controller add-on (enable in the Admin Portal).

Lists all channels in a channel group.

### Method(s)[​](#methods-3)

```
`1PubnubSubsystem->ListChannelsFromGroup(  
2    FString ChannelGroup,   
3    FOnListChannelsFromGroupResponse OnListChannelsResponse  
4);  
`
```

Parameters:
- ChannelGroup (FString): Channel group to query.
- OnListChannelsResponse (FOnListChannelsFromGroupResponse): Result delegate. Or use FOnListChannelsFromGroupResponseNative with a lambda.

#### FOnListChannelsFromGroupResponse[​](#fonlistchannelsfromgroupresponse-1)
- Result (FPubnubOperationResult): Operation result.
- Channels (TArray<FString>&): Channel names.

#### FOnListChannelsFromGroupResponseNative[​](#fonlistchannelsfromgroupresponsenative-1)
- Result (const FPubnubOperationResult&): Operation result.
- Channels (const TArray<FString>&): Channel names.

### Sample code[​](#sample-code-3)

- C++
- Blueprint

#### Actor.h[​](#actorh-9)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-9)
  

```
1
  

```

### Returns[​](#returns-3)

Void. Delegate returns FOnListChannelsFromGroupResponse.

#### FOnListChannelsFromGroupResponse[​](#fonlistchannelsfromgroupresponse-2)

  

- Result (FPubnubOperationResult): Operation result.
- Channels (TArray<FString>&): Channel names.

### Other Examples[​](#other-examples-3)

#### List channels from a channel group with lambda[​](#list-channels-from-a-channel-group-with-lambda-1)

#### Actor.h[​](#actorh-10)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-10)

  

```
1
  

```

## Remove channels from a channel group - ChannelGroup entity[​](#remove-channels-from-a-channel-group---channelgroup-entity)

Available in entities: ChannelGroup

Requires Stream Controller add-on (enable in the Admin Portal).

Removes a channel from a channel group.

### Method(s)[​](#methods-4)

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
- OnRemoveChannelFromGroupResponse (FOnRemoveChannelFromGroupResponse): Result delegate. Or use FOnRemoveChannelFromGroupResponseNative with a lambda.

#### FOnRemoveChannelFromGroupResponse[​](#fonremovechannelfromgroupresponse)
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelFromGroupResponseNative[​](#fonremovechannelfromgroupresponsenative)
- Result (const FPubnubOperationResult&): Operation result.

### Sample code[​](#sample-code-4)

- C++

#### Actor.h[​](#actorh-11)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-11)
  

```
1
  

```

### Returns[​](#returns-4)

Void. Delegate returns FOnRemoveChannelFromGroupResponse.

### Other Examples[​](#other-examples-4)

#### Remove channels from a channel group with lambda[​](#remove-channels-from-a-channel-group-with-lambda)

#### Actor.h[​](#actorh-12)

```
1
  

```

#### Actor.cpp[​](#actorcpp-12)

```
1
  

```

#### Remove channels from a channel group with result struct[​](#remove-channels-from-a-channel-group-with-result-struct)

##### Actor.h[​](#actorh-13)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-13)

  

```
1
  

```

## Remove channels from a channel group - PubNub client[​](#remove-channels-from-a-channel-group---pubnub-client)

Requires Stream Controller add-on (enable in the Admin Portal).

Removes a channel from a channel group.

### Method(s)[​](#methods-5)

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
- OnRemoveChannelFromGroupResponse (FOnRemoveChannelFromGroupResponse): Result delegate. Or use FOnRemoveChannelFromGroupResponseNative with a lambda.

#### FOnRemoveChannelFromGroupResponse[​](#fonremovechannelfromgroupresponse-1)
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelFromGroupResponseNative[​](#fonremovechannelfromgroupresponsenative-1)
- Result (const FPubnubOperationResult&): Operation result.

### Sample code[​](#sample-code-5)

- C++
- Blueprint

#### Actor.h[​](#actorh-14)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-14)
  

```
1
  

```

### Returns[​](#returns-5)

No return value.

### Other Examples[​](#other-examples-5)

#### Remove channels from a channel group with lambda[​](#remove-channels-from-a-channel-group-with-lambda-1)

#### Actor.h[​](#actorh-15)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-15)

  

```
1
  

```

#### Remove channels from a channel group with result struct[​](#remove-channels-from-a-channel-group-with-result-struct-1)

#### Actor.h[​](#actorh-16)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-16)

  

```
1
  

```

## Delete a channel group - ChannelGroup entity[​](#delete-a-channel-group---channelgroup-entity)

Available in entities: ChannelGroup

Requires Stream Controller add-on (enable in the Admin Portal).

Deletes a channel group.

### Method(s)[​](#methods-6)

```
1UPubnubChannelGroupEntity* ChannelGroupEntity = PubnubSubsystem->CreateChannelGroupEntity("my-channel-group");  
2
  
3ChannelGroupEntity->RemoveChannelGroup(  
4    FOnRemoveChannelGroupResponse OnRemoveChannelGroupResponse  
5);  

```

Parameters:
- OnRemoveChannelGroupResponse (FOnRemoveChannelGroupResponse): Result delegate. Or use FOnRemoveChannelGroupResponseNative with a lambda.

#### FOnRemoveChannelGroupResponse[​](#fonremovechannelgroupresponse)
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelGroupResponseNative[​](#fonremovechannelgroupresponsenative)
- Result (const FPubnubOperationResult&): Operation result.

### Sample code[​](#sample-code-6)

- C++

#### Actor.h[​](#actorh-17)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-17)
  

```
1
  

```

### Returns[​](#returns-6)

Void. Delegate returns FOnRemoveChannelGroupResponse.

### Other Examples[​](#other-examples-6)

#### Delete a channel group with lambda[​](#delete-a-channel-group-with-lambda)

#### Actor.h[​](#actorh-18)

```
1
  

```

#### Actor.cpp[​](#actorcpp-18)

```
1
  

```

#### Delete a channel group with result struct[​](#delete-a-channel-group-with-result-struct)

##### Actor.h[​](#actorh-19)

  

```
1
  

```

##### Actor.cpp[​](#actorcpp-19)

  

```
1
  

```

## Delete a channel group - PubNub client[​](#delete-a-channel-group---pubnub-client)

Requires Stream Controller add-on (enable in the Admin Portal).

Deletes a channel group.

### Method(s)[​](#methods-7)

```
`1PubnubSubsystem->RemoveChannelGroup(  
2    FString ChannelGroup,   
3    FOnRemoveChannelGroupResponse OnRemoveChannelGroupResponse  
4);  
`
```

Parameters:
- ChannelGroup (FString): Group to delete.
- OnRemoveChannelGroupResponse (FOnRemoveChannelGroupResponse): Result delegate. Or use FOnRemoveChannelGroupResponseNative with a lambda.

#### FOnRemoveChannelGroupResponse[​](#fonremovechannelgroupresponse-1)
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveChannelGroupResponseNative[​](#fonremovechannelgroupresponsenative-1)
- Result (const FPubnubOperationResult&): Operation result.

### Sample code[​](#sample-code-7)

- C++
- Blueprint

#### Actor.h[​](#actorh-20)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-20)
  

```
1
  

```

### Returns[​](#returns-7)

No return value.

### Other Examples[​](#other-examples-7)

#### Delete a channel group with lambda[​](#delete-a-channel-group-with-lambda-1)

#### Actor.h[​](#actorh-21)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-21)

  

```
1
  

```

#### Delete a channel group with result struct[​](#delete-a-channel-group-with-result-struct-1)

#### Actor.h[​](#actorh-22)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-22)

  

```
1
  

```

## Complete example[​](#complete-example)

#### ASample_GroupsFull.h[​](#asample_groupsfullh)

```
1
  

```

#### ASample_GroupsFull.cpp[​](#asample_groupsfullcpp)

```
1
**
```