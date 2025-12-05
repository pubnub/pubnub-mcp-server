# Message Actions API for Unreal SDK

Add or remove actions on published messages (for receipts, reactions, or custom metadata). Subscribe to channels to receive message action events. Fetch past message actions from Message Persistence independently or with message history.

##### Reactions
“Message Reactions” is a specific use of Message Actions for emoji/social reactions. In PubNub Core and Chat SDKs, this same API may be referred to as Message Reactions when used for emoji reactions.

You can use PubNub via Blueprints or C++.

- Blueprints: Use the Pubnub Subsystem node.
- C++: Add a dependency to PubnubLibrary.

In your IDE, navigate to Source/_{YourProject}_/_{YourProject}_.Build.cs and add a dependency to PubnubLibrary.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run the project.

In C++, use the PubNub SDK as any other Game Instance Subsystem.

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
- Message Actions: low-level API for metadata (read receipts, delivery confirmation, custom data).
- Message Reactions: using Message Actions specifically for emoji/social reactions.

## Add message action[​](#add-message-action)

##### Requires Message Persistence
Requires Message Persistence to be enabled for your key in the Admin Portal.

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
- MessageTimeToken (FString): Timetoken of the published message to apply the action to.
- ActionType (FString): Message action type.
- Value (FString): Message action value.
- OnAddMessageActionResponse (FOnAddMessageActionsResponse): Delegate for the operation result. You can also use a native callback of type FOnAddMessageActionsResponseNative to handle the result using a lambda.

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
Void. Result is provided via FOnAddMessageActionsResponse.

#### FOnAddMessageActionsResponse[​](#fonaddmessageactionsresponse)
- Result (FPubnubOperationResult): Result of the operation.
- MessageActionData (FPubnubMessageActionData): Message action data.

#### FOnAddMessageActionsResponseNative[​](#fonaddmessageactionsresponsenative)
- Result (const FPubnubOperationResult&): Result of the operation.
- MessageActionData (const FPubnubMessageActionData&): Message action data.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata)
- Type (FString): Message action type.
- Value (FString): Message action value.
- UserID (FString): User ID of the user who added the action.
- ActionTimetoken (FString): When the message action was added.
- MessageTimetoken (FString): When the target message was sent.

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
Requires Message Persistence to be enabled for your key in the Admin Portal.

Remove a previously added action from a published message. The response is empty.

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
- MessageTimeToken (FString): Timetoken of the published message whose action to delete.
- ActionTimeToken (FString): Timetoken of the published action to delete.
- OnRemoveMessageActionResponse (FOnRemoveMessageActionResponse): Delegate for the operation result. You can also use a native callback of type FOnRemoveMessageActionResponseNative to handle the result using a lambda.

#### FOnRemoveMessageActionResponse[​](#fonremovemessageactionresponse)
- Result (FPubnubOperationResult): Result of the operation.

#### FOnRemoveMessageActionResponseNative[​](#fonremovemessageactionresponsenative)
- Result (const FPubnubOperationResult&): Result of the operation.

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
Requires Message Persistence to be enabled for your key in the Admin Portal.

Get a list of message actions in a channel. Actions are sorted by the action’s timetoken in ascending order.

##### Truncated response
If the response is truncated, a more property is returned with additional parameters. Make iterative calls, adjusting parameters to fetch more message actions.

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
- Channel (FString): Channel the message action was published to.
- OnGetMessageActionsResponse (FOnGetMessageActionsResponse): Delegate for the operation result. You can also use a native callback of type FOnGetMessageActionsResponseNative to handle the result using a lambda.
- Start (FString): Cursor bookmark for next page. Use "" to not paginate with start.
- End (FString): Cursor bookmark for previous page. Ignored if start is supplied. Use "" to not paginate with end.
- Limit (int): Number of objects to return. Default is 100.

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
Void. Result is provided via FOnGetMessageActionsResponse.

#### FOnGetMessageActionsResponse[​](#fongetmessageactionsresponse)
- Result (FPubnubOperationResult): Result of the operation.
- MessageActions (TArray<FPubnubMessageActionData>&): Actions sent on the channel.

#### FOnGetMessageActionsResponseNative[​](#fongetmessageactionsresponsenative)
- Result (const FPubnubOperationResult&): Result of the operation.
- MessageActions (const TArray<FPubnubMessageActionData>&): Actions sent on the channel.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata-1)
- Type (FString): Message action type.
- Value (FString): Message action value.
- UserID (FString): User identifier of the user who added the action.
- ActionTimetoken (FString): When the message action was added.
- MessageTimetoken (FString): When the target message was sent.

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