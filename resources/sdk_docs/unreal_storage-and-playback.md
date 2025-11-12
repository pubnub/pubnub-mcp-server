# Message Persistence API for Unreal SDK

Message Persistence provides real-time access to stored messages (timestamped to ~10 ns). Messages can be AES-256 encrypted. Configure retention per key (1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited). You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

Use via Blueprints (Pubnub Subsystem) or C++.

To use in C++, add a dependency to PubnubLibrary in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Initialize and access the subsystem:

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

## Fetch history[​](#fetch-history)

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from one or multiple channels. You can include message actions. Ordering and window:
- Start only: returns messages older than Start timetoken.
- End only: returns messages from End timetoken and newer.
- Start and End: returns messages between them (End inclusive).

Limits: up to 100 messages on a single channel, or 25 per channel on up to 500 channels. For pagination, iteratively update Start.

### Method(s)[​](#methods)

```
`1PubnubSubsystem->FetchHistory(  
2    FString Channel,   
3    FOnFetchHistoryResponse OnFetchHistoryResponse,   
4    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()  
5);  
`
```

- Channel (FString): Target channel.
- OnFetchHistoryResponse (FOnFetchHistoryResponse): Operation result delegate. Native callback alternative: FOnFetchHistoryResponseNative.
- FetchHistorySettings (FPubnubFetchHistorySettings): History request configuration.

#### FPubnubFetchHistorySettings[​](#fpubnubfetchhistorysettings)

- MaxPerChannel (int): Messages to return. Default/max 100 for single channel; 25 for multiple channels; 25 if IncludeMessageActions is true.
- Reverse (bool): If true, oldest first. Default false.
- Start (FString): Start timetoken (exclusive).
- End (FString): End timetoken (inclusive).
- IncludeMeta (bool): Include meta.
- IncludeMessageType (bool): Include message type. Default false.
- IncludeUserID (bool): Include publisher uuid. Default false.
- IncludeMessageActions (bool): Include message actions. If true, limited to one channel and 25 messages. Default false.
- IncludeCustomMessageType (bool): Include custom message type.

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

##### Truncated response

If truncated, a more property is returned with additional parameters. Page by adjusting parameters.

### Returns[​](#returns)

Void. Delegate yields FOnFetchHistoryResponse.

#### FOnFetchHistoryResponse[​](#fonfetchhistoryresponse)

- Result (FPubnubOperationResult): Operation result.
- Messages (TArray<FPubnubHistoryMessageData>&): Retrieved history messages.

#### FOnFetchHistoryResponseNative[​](#fonfetchhistoryresponsenative)

- Result (const FPubnubOperationResult&): Operation result.
- Messages (const TArray<FPubnubHistoryMessageData>&): Retrieved history messages.

#### FPubnubHistoryMessageData[​](#fpubnubhistorymessagedata)

- Message (FString): Message text.
- UserID (FString): Sender user ID.
- timetoken (FString): Message timetoken.
- Meta (FString): Additional info.
- MessageType (FString): Message type.
- CustomMessageType (FString): Custom message type.
- MessageActions (TArray<FPubnubMessageActionData>): Message actions.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata)

- Type (FString): Action type.
- Value (FString): Action value.
- UserID (FString): User who added the action.
- ActionTimetoken (FString): When action was added.
- MessageTimetoken (FString): Target message timetoken.

### Other examples[​](#other-examples)

#### Fetch history for a specific time window[​](#fetch-history-for-a-specific-time-window)

#### Actor.h[​](#actorh-1)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-1)

  

```
1
  

```

#### Fetch history with all additional parameters[​](#fetch-history-with-all-additional-parameters)

#### Actor.h[​](#actorh-2)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-2)

  

```
1
  

```

#### Fetch history with lambda[​](#fetch-history-with-lambda)

#### Actor.h[​](#actorh-3)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-3)

  

```
1
  

```

## Delete messages from history[​](#delete-messages-from-history)

Requires Message Persistence enabled.

Removes messages from a channel’s history.

Required setting: enable Delete-From-History in key settings and initialize with a secret key.

### Method(s)[​](#methods-1)

```
`1PubnubSubsystem->DeleteMessages(  
2    FString Channel,   
3    FOnDeleteMessagesResponse OnDeleteMessagesResponse,   
4    FPubnubDeleteMessagesSettings DeleteMessagesSettings = FPubnubDeleteMessagesSettings()  
5);  
`
```

- Channel (FString): Target channel.
- OnDeleteMessagesResponse (FOnDeleteMessagesResponse): Operation result delegate. Native callback alternative: FOnDeleteMessagesResponseNative.
- DeleteMessagesSettings (FPubnubDeleteMessagesSettings): Delete configuration.

#### FPubnubDeleteMessagesSettings[​](#fpubnubdeletemessagessettings)

- Start (FString): Start timetoken (inclusive).
- End (FString): End timetoken (exclusive).

### Sample code[​](#sample-code-1)

- C++
- Blueprint

#### Actor.h[​](#actorh-4)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-4)
  

```
1
  

```

### Returns[​](#returns-1)

Void. Delegate yields FOnDeleteMessagesResponse.

#### FOnDeleteMessagesResponse[​](#fondeletemessagesresponse)

- Result (FPubnubOperationResult): Operation result.

#### FOnDeleteMessagesResponseNative[​](#fondeletemessagesresponsenative)

- Result (const FPubnubOperationResult&): Operation result.

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

Delete a specific message using its publish timetoken T: set Start = T - 1 and End = T (e.g., Start 15526611838554309, End 15526611838554310).

#### Actor.h[​](#actorh-5)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-5)

  

```
1
  

```

#### Delete messages with result struct[​](#delete-messages-with-result-struct)

#### Actor.h[​](#actorh-6)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-6)

  

```
1
  

```

#### Delete messages with lambda[​](#delete-messages-with-lambda)

#### Actor.h[​](#actorh-7)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-7)

  

```
1
  

```

## Message counts[​](#message-counts)

Requires Message Persistence enabled.

Returns the number of messages published on one or more channels since a given timetoken (inclusive). For keys with unlimited retention, considers only messages from the last 30 days.

### Method(s)[​](#methods-2)

```
`1PubnubSubsystem->MessageCounts(  
2    FString Channel,   
3    FString Timetoken,   
4    FOnMessageCountsResponse OnMessageCountsResponse  
5);  
`
```

- Channel (FString): Target channel.
- timetoken (FString): Starting timetoken.
- OnMessageCountsResponse (FOnMessageCountsResponse): Operation result delegate. Native callback alternative: FOnMessageCountsResponseNative.

### Sample code[​](#sample-code-2)

- C++
- Blueprint

#### Actor.h[​](#actorh-8)
  

```
1
  

```

#### Actor.cpp[​](#actorcpp-8)
  

```
1
  

```

### Returns[​](#returns-2)

Void. Delegate yields FOnMessageCountsResponse.

#### FOnMessageCountsResponse[​](#fonmessagecountsresponse)

- Result (FPubnubOperationResult): Operation result.
- MessageCounts (int): Count since timetoken.

#### FOnMessageCountsResponseNative[​](#fonmessagecountsresponsenative)

- Result (const FPubnubOperationResult&): Operation result.
- MessageCounts (int): Count since timetoken.

### Other examples[​](#other-examples-2)

#### Message counts with lambda[​](#message-counts-with-lambda)

#### Actor.h[​](#actorh-9)

  

```
1
  

```

#### Actor.cpp[​](#actorcpp-9)

  

```
1
**
```
Last updated on Sep 3, 2025**