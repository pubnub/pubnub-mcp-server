# Message Persistence API for Unreal SDK

Message Persistence provides real-time access to stored messages. Configure retention in the Admin Portal (1 day to Unlimited). You can retrieve:
- Messages
- Message reactions
- Files (via File Sharing API)

Requires Message Persistence enabled for your key.

You can use PubNub via Blueprints or C++.

In Blueprints, call the Pubnub Subsystem node.

In C++, add dependency to PubnubLibrary:

In your IDE, navigate to Source/_{YourProject}_/_{YourProject}_.Build.cs and add a dependency to PubnubLibrary.

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run. Use PubNub SDK as any other Game Instance Subsystem:

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

##### Requires Message Persistence

Fetch historical messages from one or more channels. Include message actions with IncludeMessageActions. Ordering:
- Only Start: messages older than Start timetoken.
- Only End: messages at End and newer.
- Both: messages between Start and End (End inclusive).

Limits: up to 100 on a single channel; or 25 per channel on up to 500 channels. With IncludeMessageActions=true: 1 channel, max 25 messages. Page by iteratively updating Start.

### Method(s)[​](#methods)

```
`1PubnubSubsystem->FetchHistory(  
2    FString Channel,   
3    FOnFetchHistoryResponse OnFetchHistoryResponse,   
4    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()  
5);  
`
```

- Channel Type: FString — Channel to fetch history for.
- OnFetchHistoryResponse Type: FOnFetchHistoryResponse — Result delegate. You can also use native callback FOnFetchHistoryResponseNative.
- FetchHistorySettings Type: FPubnubFetchHistorySettings — History configuration.

#### FPubnubFetchHistorySettings[​](#fpubnubfetchhistorysettings)

- MaxPerChannel Type: int — Number of messages to return. Default/max 100 for single channel; 25 for multiple; 25 if IncludeMessageActions=true.
- Reverse Type: bool — true to return oldest first. Default false.
- Start Type: FString — Timetoken start (exclusive).
- End Type: FString — Timetoken end (inclusive).
- IncludeMeta Type: bool — Include message meta.
- IncludeMessageType Type: bool — Include message type. Default false.
- IncludeUserID Type: bool — Include publisher uuid. Default false.
- IncludeMessageActions Type: bool — Include message actions; limits to one channel and 25 messages. Default false.
- IncludeCustomMessageType Type: bool — Include custom message type.

For more information, refer to Retrieving Messages.

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
If truncated, a more property is returned. Make iterative calls adjusting parameters.

### Returns[​](#returns)
Void. Delegate returns FOnFetchHistoryResponse.

#### FOnFetchHistoryResponse[​](#fonfetchhistoryresponse)

- Result FPubnubOperationResult — Operation result.
- Messages TArray<FPubnubHistoryMessageData>& — Historical messages.

#### FOnFetchHistoryResponseNative[​](#fonfetchhistoryresponsenative)

- Result const FPubnubOperationResult& — Operation result.
- Messages const TArray<FPubnubHistoryMessageData>& — Historical messages.

#### FPubnubHistoryMessageData[​](#fpubnubhistorymessagedata)

- Message FString — Message text.
- UserID FString — Sender user ID.
- timetoken FString — Send timetoken.
- Meta FString — Additional info.
- MessageType FString — Message type.
- CustomMessageType FString — Custom message type.
- MessageActions TArray<FPubnubMessageActionData> — Message actions.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata)

- Type FString — Action type.
- Value FString — Action value.
- UserID FString — User who added action.
- ActionTimetoken FString — When action added.
- MessageTimetoken FString — Original message timetoken.

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

##### Requires Message Persistence

Remove messages from a channel’s history.

##### Required setting
Enable Delete-From-History in key settings and initialize with a secret key.

### Method(s)[​](#methods-1)

```
`1PubnubSubsystem->DeleteMessages(  
2    FString Channel,   
3    FOnDeleteMessagesResponse OnDeleteMessagesResponse,   
4    FPubnubDeleteMessagesSettings DeleteMessagesSettings = FPubnubDeleteMessagesSettings()  
5);  
`
```

- Channel Type: FString — Channel to delete from.
- OnDeleteMessagesResponse Type: FOnDeleteMessagesResponse — Result delegate. You can also use native callback FOnDeleteMessagesResponseNative.
- DeleteMessagesSettings Type: FPubnubDeleteMessagesSettings — Delete configuration.

#### FPubnubDeleteMessagesSettings[​](#fpubnubdeletemessagessettings)

- Start Type: FString — Start timetoken (inclusive).
- End Type: FString — End timetoken (exclusive).

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

- Result FPubnubOperationResult — Operation result.

#### FOnDeleteMessagesResponseNative[​](#fondeletemessagesresponsenative)

- Result const FPubnubOperationResult& — Operation result.

### Other examples[​](#other-examples-1)

#### Delete specific message from history[​](#delete-specific-message-from-history)

Pass the publish timetoken in End and timetoken-1 in Start. Example: Start=15526611838554309, End=15526611838554310.

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

##### Requires Message Persistence

Return the number of messages since a given timetoken (messages with timetoken >= provided value).

##### Unlimited message retention
With unlimited retention, only messages from the last 30 days are counted.

### Method(s)[​](#methods-2)

```
`1PubnubSubsystem->MessageCounts(  
2    FString Channel,   
3    FString Timetoken,   
4    FOnMessageCountsResponse OnMessageCountsResponse  
5);  
`
```

- Channel Type: FString — Channel(s) to count.
- timetoken Type: FString — Starting timetoken.
- OnMessageCountsResponse Type: FOnMessageCountsResponse — Result delegate. You can also use native callback FOnMessageCountsResponseNative.

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

- Result FPubnubOperationResult — Operation result.
- MessageCounts int — Number of messages since timetoken.

#### FOnMessageCountsResponseNative[​](#fonmessagecountsresponsenative)

- Result const FPubnubOperationResult& — Operation result.
- MessageCounts int — Number of messages since timetoken.

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