# Message Actions API for Unreal SDK

Add or remove actions on published messages (reactions/receipts/custom metadata). Subscribe to channels to receive message action events. Fetch historical message actions from Message Persistence or when fetching messages.

##### Reactions
“Message Reactions” are Message Actions used for emoji/social reactions. Core/Chat SDKs may refer to the same API as “Message Reactions.”

You can use PubNub via Blueprints or C++.

- Blueprints: Use the Pubnub Subsystem node.
- C++: Add a dependency to PubnubLibrary.

In your IDE, navigate to `Source/_{YourProject}_/_{YourProject}_.Build.cs` and add:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run. Use the SDK as a Game Instance Subsystem:

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
- Message Actions: low-level metadata API (receipts, delivery confirmations, custom data).
- Message Reactions: using Message Actions specifically for emoji/social reactions.

## Add message action[​](#add-message-action)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal for your key.

Add an action to a published message.

### Method(s)[​](#methods)

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
- MessageTimeToken (FString): Timetoken of the message to apply the action to.
- ActionType (FString): Message action type.
- Value (FString): Message action value.
- OnAddMessageActionResponse (FOnAddMessageActionsResponse): Delegate for the operation result.
- Native callback alternative: FOnAddMessageActionsResponseNative (lambda-compatible).

### Sample code[​](#sample-code)

- C++
- Blueprint

#### Actor.h[​](#actorh)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp)
  

```
1
  

```

### Returns[​](#returns)
Void. Result provided via FOnAddMessageActionsResponse.

#### FOnAddMessageActionsResponse[​](#fonaddmessageactionsresponse)
- Result (FPubnubOperationResult): Operation result.
- MessageActionData (FPubnubMessageActionData): Message action data.

#### FOnAddMessageActionsResponseNative[​](#fonaddmessageactionsresponsenative)
- Result (const FPubnubOperationResult&): Operation result.
- MessageActionData (const FPubnubMessageActionData&): Message action data.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata)
- Type (FString): Message action type.
- Value (FString): Message action value.
- UserID (FString): User who added the action.
- ActionTimetoken (FString): When the action was added.
- MessageTimetoken (FString): When the original message was sent.

### Other examples[​](#other-examples)

#### Add a message action with lambda[​](#add-a-message-action-with-lambda)

#### Actor.h[​](#actorh-1)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-1)

  

```
1
  

```

#### Add a message action with result struct[​](#add-a-message-action-with-result-struct)

#### Actor.h[​](#actorh-2)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-2)

  

```
1
  

```

## Remove message action[​](#remove-message-action)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal for your key.

Remove a previously added action from a published message.

### Method(s)[​](#methods-1)

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
- MessageTimeToken (FString): Timetoken of the message whose action you’re deleting.
- ActionTimeToken (FString): Timetoken of the action to delete.
- OnRemoveMessageActionResponse (FOnRemoveMessageActionResponse): Delegate for result.
- Native callback alternative: FOnRemoveMessageActionResponseNative (lambda-compatible).

#### FOnRemoveMessageActionResponse[​](#fonremovemessageactionresponse)
- Result (FPubnubOperationResult): Operation result.

#### FOnRemoveMessageActionResponseNative[​](#fonremovemessageactionresponsenative)
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
No return value; use delegate for results.

### Other examples[​](#other-examples-1)

#### Remove a message action with lambda[​](#remove-a-message-action-with-lambda)

#### Actor.h[​](#actorh-4)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-4)

  

```
1
  

```

#### Remove a message action with result struct[​](#remove-a-message-action-with-result-struct)

#### Actor.h[​](#actorh-5)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-5)

  

```
1
  

```

## Get message actions[​](#get-message-actions)

##### Requires Message Persistence
Enable Message Persistence in the Admin Portal for your key.

Get a list of message actions in a channel, sorted by action timetoken ascending.

##### Truncated response
If truncated, response includes a more property with parameters for pagination. Use iterative calls with provided cursors.

### Method(s)[​](#methods-2)

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
- OnGetMessageActionsResponse (FOnGetMessageActionsResponse): Delegate for the result.
- Native callback alternative: FOnGetMessageActionsResponseNative (lambda-compatible).
- Start (FString): Cursor to fetch the next page. Use "" to not use a start cursor.
- End (FString): Cursor to fetch the previous page. Ignored if Start is provided. Use "" to not use an end cursor.
- Limit (int): Number of objects to return. Default 100.

### Sample code[​](#sample-code-2)

- C++
- Blueprint

#### Actor.h[​](#actorh-6)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-6)
  

```
1
  

```

### Returns[​](#returns-2)
Void. Result provided via FOnGetMessageActionsResponse.

#### FOnGetMessageActionsResponse[​](#fongetmessageactionsresponse)
- Result (FPubnubOperationResult): Operation result.
- MessageActions (TArray<FPubnubMessageActionData>&): Array of message actions.

#### FOnGetMessageActionsResponseNative[​](#fongetmessageactionsresponsenative)
- Result (const FPubnubOperationResult&): Operation result.
- MessageActions (const TArray<FPubnubMessageActionData>&): Array of message actions.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata-1)
- Type (FString): Message action type.
- Value (FString): Message action value.
- UserID (FString): User identifier.
- ActionTimetoken (FString): When the action was added.
- MessageTimetoken (FString): When the message was sent.

### Other examples[​](#other-examples-2)

#### Get message actions with lambda[​](#get-message-actions-with-lambda)

#### Actor.h[​](#actorh-7)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-7)

  

```
1
  

```

#### Get message actions from a channel with a specific time window and limit[​](#get-message-actions-from-a-channel-with-a-specific-time-window-and-limit)

#### Actor.h[​](#actorh-8)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-8)

  

```
1
  

```

## History with message reactions[​](#history-with-message-reactions)
You can include message actions when fetching historical messages. See Fetch History.

## Complete example[​](#complete-example)

#### ASample_MessageActionsFull.h[​](#asample_messageactionsfullh)

```
1
  

```

#### ASample_MessageActionsFull.cpp[​](#asample_messageactionsfullcpp)

```
1
**
```
Last updated on Sep 3, 2025**