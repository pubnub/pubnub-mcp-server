# Message Persistence API for Unreal SDK

Message Persistence stores and retrieves published messages. Each message is timestamped (10 ns precision) and can be AES-256 encrypted. Configure retention in the Admin Portal (1 day to Unlimited). You can retrieve messages, message reactions, and files.

Use via Blueprints (Pubnub Subsystem) or C++.

C++ setup:
- Add dependency to PubnubLibrary in Source/YourProject/YourProject.Build.cs
```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```
- Access the subsystem:
```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```
- Example:
```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

## Fetch history[​](#fetch-history)

Requires Message Persistence enabled for your key.

Fetch historical messages from one or multiple channels; optionally include message actions. Ordering/interval:
- Only Start: returns messages older than Start.
- Only End: returns messages from End and newer.
- Both Start and End: returns messages between them (End inclusive).

Limits: up to 100 messages on a single channel, or 25 per channel across up to 500 channels. With IncludeMessageActions=true, limited to one channel and 25 messages. Page by updating Start.

### Method(s)[​](#methods)

```
`1PubnubSubsystem->FetchHistory(  
2    FString Channel,   
3    FOnFetchHistoryResponse OnFetchHistoryResponse,   
4    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()  
5);  
`
```

Parameters:
- Channel (FString): Channel to fetch history from.
- OnFetchHistoryResponse (FOnFetchHistoryResponse): Result delegate. You can also use FOnFetchHistoryResponseNative for a lambda.
- FetchHistorySettings (FPubnubFetchHistorySettings): History configuration.

#### FPubnubFetchHistorySettings[​](#fpubnubfetchhistorysettings)

- MaxPerChannel (int): Messages to return. Default/max 100 for single channel; 25 for multiple channels; 25 if IncludeMessageActions=true.
- Reverse (bool): true returns oldest first. Default false.
- Start (FString): Timetoken start (exclusive).
- End (FString): Timetoken end (inclusive).
- IncludeMeta (bool): Include metadata.
- IncludeMessageType (bool): Include message type. Default false.
- IncludeUserID (bool): Include publisher uuid. Default false.
- IncludeMessageActions (bool): Include message actions; forces one channel and 25 messages max. Default false.
- IncludeCustomMessageType (bool): Include custom message type.

For more, see Retrieving Messages.

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
If truncated, a more property is returned with additional parameters. Make iterative calls adjusting parameters.

### Returns[​](#returns)

Void. Delegate returns FOnFetchHistoryResponse.

#### FOnFetchHistoryResponse[​](#fonfetchhistoryresponse)

- Result (FPubnubOperationResult): Operation result.
- Messages (TArray<FPubnubHistoryMessageData>&): Array of history messages.

#### FOnFetchHistoryResponseNative[​](#fonfetchhistoryresponsenative)

- Result (const FPubnubOperationResult&): Operation result.
- Messages (const TArray<FPubnubHistoryMessageData>&): Array of history messages.

#### FPubnubHistoryMessageData[​](#fpubnubhistorymessagedata)

- Message (FString): Message text.
- UserID (FString): Publisher user ID.
- timetoken (FString): When the message was sent.
- Meta (FString): Additional info.
- MessageType (FString): See Message types.
- CustomMessageType (FString): Custom message type.
- MessageActions (TArray<FPubnubMessageActionData>): Associated message actions.

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

Requires Message Persistence. Also:
- Enable Delete-From-History in key settings.
- Initialize with a secret key.

Removes messages from a channel’s history. Use Start/End timetokens to define the range.

### Method(s)[​](#methods-1)

```
`1PubnubSubsystem->DeleteMessages(  
2    FString Channel,   
3    FOnDeleteMessagesResponse OnDeleteMessagesResponse,   
4    FPubnubDeleteMessagesSettings DeleteMessagesSettings = FPubnubDeleteMessagesSettings()  
5);  
`
```

Parameters:
- Channel (FString): Channel whose history to delete.
- OnDeleteMessagesResponse (FOnDeleteMessagesResponse): Result delegate. Or use FOnDeleteMessagesResponseNative for a lambda.
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

Void. Delegate returns FOnDeleteMessagesResponse.

#### FOnDeleteMessagesResponse[​](#fondeletemessagesresponse)

- Result (FPubnubOperationResult): Operation result.

#### FOnDeleteMessagesResponseNative[​](#fondeletemessagesresponsenative)

- Result (const FPubnubOperationResult&): Operation result.

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

To delete a specific message, pass the message’s publish timetoken in End and timetoken-1 in Start. Example: publish timetoken 15526611838554310 → Start 15526611838554309, End 15526611838554310.

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

Requires Message Persistence. Returns the number of messages on one or more channels since a given timetoken (messages in history with timetoken >= provided value).

Unlimited retention note: for keys with unlimited retention, only messages from the last 30 days are considered.

### Method(s)[​](#methods-2)

```
`1PubnubSubsystem->MessageCounts(  
2    FString Channel,   
3    FString Timetoken,   
4    FOnMessageCountsResponse OnMessageCountsResponse  
5);  
`
```

Parameters:
- Channel (FString): Channel to get counts for.
- timetoken (FString): Starting timetoken.
- OnMessageCountsResponse (FOnMessageCountsResponse): Result delegate. Or use FOnMessageCountsResponseNative for a lambda.

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

Void. Delegate returns FOnMessageCountsResponse.

#### FOnMessageCountsResponse[​](#fonmessagecountsresponse)

- Result (FPubnubOperationResult): Operation result.
- MessageCounts (int): Number of messages since the given time.

#### FOnMessageCountsResponseNative[​](#fonmessagecountsresponsenative)

- Result (const FPubnubOperationResult&): Operation result.
- MessageCounts (int): Number of messages since the given time.

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