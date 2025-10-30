# Message Actions API for Unreal SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events. They can also fetch past message actions from Message Persistence independently or with original messages.

##### Reactions
Message Reactions are a specific use of Message Actions for emoji/social reactions. In PubNub Core and Chat SDKs, Message Actions used for emoji reactions are referred to as Message Reactions but use the same API.

You can use PubNub via Blueprints or C++.

- Blueprints: use the Pubnub Subsystem node.
- C++: add a dependency to PubnubLibrary.

In your IDE, navigate to `Source/_{YourProject}_/_{YourProject}_.Build.cs` and add:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run the project.

Use the SDK as a Game Instance Subsystem:

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

##### Message Actions vs. Message Reactions
- Message Actions: add metadata (read receipts, delivery confirmations, custom data).
- Message Reactions: use Message Actions specifically for emoji/social reactions.

## Add message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Add an action to a published message.

### Method(s)

```
`1PubnubSubsystem->AddMessageAction(  
2    FString Channel,   
3    FString MessageTimeToken,   
4    FString ActionType,    
5    FString Value,  
6    FOnAddMessageActionsResponse OnAddMessageActionResponse  
7);  
`
```

Parameters:
- Channel (FString): Channel to publish the message action to.
- MessageTimeToken (FString): Timetoken of the published message to apply the action to.
- ActionType (FString): Message action type.
- Value (FString): Message action value.
- OnAddMessageActionResponse (FOnAddMessageActionsResponse): Delegate for the operation result.
- Native alternative: FOnAddMessageActionsResponseNative (lambda-capable).

### Sample code

##### Reference code

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
Void. Use the delegate result.

#### FOnAddMessageActionsResponse
- Result (FPubnubOperationResult): Result of the operation.
- MessageActionData (FPubnubMessageActionData): Message action data.

#### FOnAddMessageActionsResponseNative
- Result (const FPubnubOperationResult&): Result of the operation.
- MessageActionData (const FPubnubMessageActionData&): Message action data.

#### FPubnubMessageActionData
- Type (FString): Message action type.
- Value (FString): Message action value.
- UserID (FString): User ID who added the action.
- ActionTimetoken (FString): When the message action was added.
- MessageTimetoken (FString): When the target message was sent.

### Other examples

##### Reference code

#### Add a message action with lambda

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Add a message action with result struct

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

## Remove message action

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

### Method(s)

```
`1PubnubSubsystem->RemoveMessageAction(  
2    FString Channel,   
3    FString MessageTimeToken,   
4    FString ActionTimeToken,  
5    FOnRemoveMessageActionResponse OnRemoveMessageActionResponse  
6);  
`
```

Parameters:
- Channel (FString): Channel the message action was published to.
- MessageTimeToken (FString): Timetoken of the published message whose action to delete.
- ActionTimeToken (FString): Timetoken of the action to delete.
- OnRemoveMessageActionResponse (FOnRemoveMessageActionResponse): Delegate for the operation result.
- Native alternative: FOnRemoveMessageActionResponseNative (lambda-capable).

#### FOnRemoveMessageActionResponse
- Result (FPubnubOperationResult): Result of the operation.

#### FOnRemoveMessageActionResponseNative
- Result (const FPubnubOperationResult&): Result of the operation.

### Sample code

##### Reference code

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
No return value.

### Other examples

##### Reference code

#### Remove a message action with lambda

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Remove a message action with result struct

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

## Get message actions

##### Requires Message Persistence
Enable Message Persistence for your key in the Admin Portal.

Get a list of message actions in a channel. Sorted by action timetoken ascending.

##### Truncated response
If truncated, a more property is returned. Use returned cursor bookmarks to paginate.

### Method(s)

```
`1PubnubSubsystem->GetMessageActions(  
2    FString Channel,  
3    FOnGetMessageActionsResponse OnGetMessageActionsResponse,  
4    FString Start = "",   
5    FString End = "",   
6    int Limit = 0  
7);  
`
```

Parameters:
- Channel (FString): Channel the message actions were published to.
- OnGetMessageActionsResponse (FOnGetMessageActionsResponse): Delegate for the operation result.
- Native alternative: FOnGetMessageActionsResponseNative (lambda-capable).
- Start (FString): Cursor for next page; use "" to avoid start pagination.
- End (FString): Cursor for previous page; ignored if Start is supplied; use "" to avoid end pagination.
- Limit (int): Number of objects to return. Default 100.

### Sample code

##### Reference code

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
Void. Use the delegate result.

#### FOnGetMessageActionsResponse
- Result (FPubnubOperationResult): Result of the operation.
- MessageActions (TArray<FPubnubMessageActionData>&): Actions for the channel.

#### FOnGetMessageActionsResponseNative
- Result (const FPubnubOperationResult&): Result of the operation.
- MessageActions (const TArray<FPubnubMessageActionData>&): Actions for the channel.

#### FPubnubMessageActionData
- Type (FString): Message action type.
- Value (FString): Message action value.
- UserID (FString): User identifier of the user who added the action.
- ActionTimetoken (FString): When the message action was added.
- MessageTimetoken (FString): When the target message was sent.

### Other examples

##### Reference code

#### Get message actions with lambda

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

#### Get message actions from a channel with a specific time window and limit

#### Actor.h
```
1
  

```

#### Actor.cpp
```
1
  

```

## History with message reactions
You can include message actions when fetching historical messages. See Fetch History.

## Complete example

##### Reference code

#### ASample_MessageActionsFull.h
```
1
  

```

#### ASample_MessageActionsFull.cpp
```
1
**
```
Last updated on Sep 3, 2025**