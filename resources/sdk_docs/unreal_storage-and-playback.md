# Message Persistence API for Unreal SDK

Message Persistence provides access to stored, timestamped messages (10 ns precision) replicated across multiple regions. Stored messages can be encrypted with AES-256. See Message Persistence.

Retention policy options: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, Unlimited.

Retrievable data:
- Messages
- Message reactions
- Files (via File Sharing API)

You can use PubNub via Blueprints or C++.

In Blueprints, use the Pubnub Subsystem node.

In C++, add a dependency to PubnubLibrary:

In `Source/_{YourProject}_/_{YourProject}_.Build.cs`:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run the project.

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

## Fetch history

Requires Message Persistence enabled for your key in the Admin Portal.

Fetch historical messages from channels. IncludeMessageActions can fetch actions along with messages.

Ordering:
- Start only: messages older than Start timetoken.
- End only: messages from End timetoken and newer.
- Start and End: messages between Start and End (End inclusive).

Limits: up to 100 messages on a single channel, or 25 per channel on up to 500 channels. For paging, iteratively update Start. If IncludeMessageActions = true, limited to one channel and 25 messages.

### Method(s)

```
`1PubnubSubsystem->FetchHistory(  
2    FString Channel,   
3    FOnFetchHistoryResponse OnFetchHistoryResponse,   
4    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()  
5);  
`
```

Parameters:
- Channel — Type: FString. The channel to fetch messages from.
- OnFetchHistoryResponse — Type: FOnFetchHistoryResponse. Delegate for the result. You can also use FOnFetchHistoryResponseNative to handle the result using a lambda.
- FetchHistorySettings — Type: FPubnubFetchHistorySettings. History configuration.

#### FPubnubFetchHistorySettings

- MaxPerChannel — Type: int. Number of messages to return. Default/max: 100 for single channel; 25 for multiple channels; 25 if IncludeMessageActions = true.
- Reverse — Type: bool. If true, traverse from oldest first. Default false.
- Start — Type: FString. Timetoken delimiting the start (exclusive).
- End — Type: FString. Timetoken delimiting the end (inclusive).
- IncludeMeta — Type: bool. Include meta in response.
- IncludeMessageType — Type: bool. Include message type. Default false.
- IncludeUserID — Type: bool. Include publisher uuid. Default false.
- IncludeMessageActions — Type: bool. Retrieve messages with message actions. If true, limited to one channel and 25 messages. Default false.
- IncludeCustomMessageType — Type: bool. Retrieve custom message type.

For more details, see Retrieving Messages.

### Sample code

Reference code
Set up your Unreal project and follow the instructions in the lines marked with ACTION REQUIRED before running the code.

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

##### Truncated response

If truncated, a more property will be returned with additional parameters. Make iterative calls adjusting parameters.

### Returns

This function is void, but the delegate returns the FOnFetchHistoryResponse struct.

#### FOnFetchHistoryResponse

- Result — FPubnubOperationResult. The result of the operation.
- Messages — TArray<FPubnubHistoryMessageData>&. Historical messages.

#### FOnFetchHistoryResponseNative

- Result — const FPubnubOperationResult&. The result of the operation.
- Messages — const TArray<FPubnubHistoryMessageData>&. Historical messages.

#### FPubnubHistoryMessageData

- Message — FString. Message text.
- UserID — FString. Sender user ID.
- timetoken — FString. When the message was sent.
- Meta — FString. Additional information.
- MessageType — FString. See Message types.
- CustomMessageType — FString. Custom message type.
- MessageActions — TArray<FPubnubMessageActionData>. Message actions linked to the message.

#### FPubnubMessageActionData

- Type — FString. Action type.
- Value — FString. Action value.
- UserID — FString. User who added the action.
- ActionTimetoken — FString. When the action was added.
- MessageTimetoken — FString. When the target message was sent.

### Other examples

Reference code
Set up your Unreal project and follow the instructions in the lines marked with ACTION REQUIRED before running the code.

#### Fetch history for a specific time window

You can add a time window to the request:

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Fetch history with all additional parameters

You can add additional parameters to the request:

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Fetch history with lambda

You can use a lambda function to handle the response:

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## Delete messages from history

Requires Message Persistence enabled for your key.

Removes messages from a channel’s history.

Required setting:
- Enable Delete-From-History in key settings and initialize with a secret key.

### Method(s)

```
`1PubnubSubsystem->DeleteMessages(  
2    FString Channel,   
3    FOnDeleteMessagesResponse OnDeleteMessagesResponse,   
4    FPubnubDeleteMessagesSettings DeleteMessagesSettings = FPubnubDeleteMessagesSettings()  
5);  
`
```

Parameters:
- Channel — Type: FString. Channel to delete messages from.
- OnDeleteMessagesResponse — Type: FOnDeleteMessagesResponse. Delegate for the result. You can also use FOnDeleteMessagesResponseNative to handle the result using a lambda.
- DeleteMessagesSettings — Type: FPubnubDeleteMessagesSettings. Delete configuration.

#### FPubnubDeleteMessagesSettings

- Start — Type: FString. Start timetoken (inclusive).
- End — Type: FString. End timetoken (exclusive).

### Sample code

Reference code
Set up your Unreal project and follow the instructions in the lines marked with ACTION REQUIRED before running the code.

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

This function is void, but the delegate returns the FOnDeleteMessagesResponse struct.

#### FOnDeleteMessagesResponse

- Result — FPubnubOperationResult. The result of the operation.

#### FOnDeleteMessagesResponseNative

- Result — const FPubnubOperationResult&. The result of the operation.

### Other examples

Reference code
Set up your Unreal project and follow the instructions in the lines marked with ACTION REQUIRED before running the code.

#### Delete specific message from history

To delete a specific message, pass the publish timetoken in End and timetoken - 1 in Start. Example: for 15526611838554310, use Start 15526611838554309 and End 15526611838554310.

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Delete messages with result struct

You can use the result struct to handle the response:

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

#### Delete messages with lambda

You can use a lambda function to handle the response:

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```

## Message counts

Requires Message Persistence enabled for your key.

Returns the number of messages published on one or more channels since a given timetoken (inclusive).

Unlimited message retention: considers only messages published in the last 30 days.

### Method(s)

```
`1PubnubSubsystem->MessageCounts(  
2    FString Channel,   
3    FString Timetoken,   
4    FOnMessageCountsResponse OnMessageCountsResponse  
5);  
`
```

Parameters:
- Channel — Type: FString. Channel to get counts for.
- timetoken — Type: FString. Starting timetoken.
- OnMessageCountsResponse — Type: FOnMessageCountsResponse. Delegate for the result. You can also use FOnMessageCountsResponseNative to handle the result using a lambda.

### Sample code

Reference code
Set up your Unreal project and follow the instructions in the lines marked with ACTION REQUIRED before running the code.

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

This function is void, but the delegate returns the FOnMessageCountsResponse struct.

#### FOnMessageCountsResponse

- Result — FPubnubOperationResult. The result of the operation.
- MessageCounts — int. Number of messages since the timetoken.

#### FOnMessageCountsResponseNative

- Result — const FPubnubOperationResult&. The result of the operation.
- MessageCounts — int. Number of messages since the timetoken.

### Other examples

Reference code
Set up your Unreal project and follow the instructions in the lines marked with ACTION REQUIRED before running the code.

#### Message counts with lambda

You can use a lambda function to handle the response:

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
**
```
Last updated on Sep 3, 2025**