# Message Actions API for Unreal SDK

Add or remove actions (reactions, receipts, custom metadata) on published messages. Subscribe to channels to receive message action events and fetch past actions from Message Persistence. Use via Blueprints (Pubnub Subsystem node) or C++.

- Blueprints: Start with the Pubnub Subsystem node.
- C++: Add dependency to PubnubLibrary and use the Game Instance Subsystem.

In your IDE, navigate to `Source/_{YourProject}_/_{YourProject}_.Build.cs` and add:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Example: Get the subsystem and call SDK functions:

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

### Message Actions vs. Message Reactions

- Message Actions: generic low-level API for adding metadata (receipts, confirmations, custom data).
- Message Reactions: use of Message Actions for emoji/social reactions in PubNub Core and Chat SDKs (same underlying API).

## Add message action

Requires Message Persistence to be enabled for your key in the Admin Portal.

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
- MessageTimeToken (FString): Timetoken of the target message.
- ActionType (FString): Message action type.
- Value (FString): Message action value.
- OnAddMessageActionResponse (FOnAddMessageActionsResponse): Delegate for operation result.
- Optional: Use FOnAddMessageActionsResponseNative for a lambda callback.

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

Void. Result provided via delegate FOnAddMessageActionsResponse.

#### FOnAddMessageActionsResponse

- Result: FPubnubOperationResult
- MessageActionData: FPubnubMessageActionData

#### FOnAddMessageActionsResponseNative

- Result: const FPubnubOperationResult&
- MessageActionData: const FPubnubMessageActionData&

#### FPubnubMessageActionData

- Type: FString
- Value: FString
- UserID: FString
- ActionTimetoken: FString
- MessageTimetoken: FString

### Other examples

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

Requires Message Persistence to be enabled for your key in the Admin Portal.

Remove a previously added action from a published message. Response payload is empty.

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
- Channel (FString): Channel the action was published to.
- MessageTimeToken (FString): Timetoken of the target message.
- ActionTimeToken (FString): Timetoken of the action to delete.
- OnRemoveMessageActionResponse (FOnRemoveMessageActionResponse): Delegate for operation result.
- Optional: Use FOnRemoveMessageActionResponseNative for a lambda callback.

#### FOnRemoveMessageActionResponse

- Result: FPubnubOperationResult

#### FOnRemoveMessageActionResponseNative

- Result: const FPubnubOperationResult&

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

No return value. Result provided via delegate.

### Other examples

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

Requires Message Persistence to be enabled for your key in the Admin Portal.

Get a list of message actions in a channel, sorted by action timetoken (ascending).

Truncated response:
- If truncated, a more property is returned with cursor parameters. Paginate with Start/End to fetch additional actions.

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
- Channel (FString): Channel to query.
- OnGetMessageActionsResponse (FOnGetMessageActionsResponse): Delegate for operation result.
- Optional:
  - Start (FString): Cursor to fetch next page. Use "" to disable.
  - End (FString): Cursor to fetch previous page. Ignored if Start is provided. Use "" to disable.
  - Limit (int): Number of objects to return. Default 100.
- Optional: Use FOnGetMessageActionsResponseNative for a lambda callback.

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

Void. Result provided via delegate FOnGetMessageActionsResponse.

#### FOnGetMessageActionsResponse

- Result: FPubnubOperationResult
- MessageActions: TArray<FPubnubMessageActionData>&

#### FOnGetMessageActionsResponseNative

- Result: const FPubnubOperationResult&
- MessageActions: const TArray<FPubnubMessageActionData>&

#### FPubnubMessageActionData

- Type: FString
- Value: FString
- UserID: FString
- ActionTimetoken: FString
- MessageTimetoken: FString

### Other examples

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

You can return message actions when fetching historical messages. See Fetch History for details.

## Complete example

#### ASample_MessageActionsFull.h
```
1
  

```

#### ASample_MessageActionsFull.cpp
```
1
**
```

Last updated on Sep 3, 2025