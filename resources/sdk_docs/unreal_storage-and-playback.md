On this page
# Message Persistence API for Unreal SDK

Message Persistence provides real-time access to the history of all messages published to PubNub. Each published message is timestamped to the nearest 10 nanoseconds and is stored across multiple availability zones in several geographical locations. Stored messages can be encrypted with AES-256 message encryption, ensuring that they are not readable while stored on PubNub's network. For more information, refer to [Message Persistence](/docs/general/storage).

Messages can be stored for a configurable duration or forever, as controlled by the retention policy that is configured on your account. The following options are available: 1 day, 7 days, 30 days, 3 months, 6 months, 1 year, or Unlimited.

You can retrieve the following:

- Messages

- Message reactions

- File Sharing (using File Sharing API)

### Usage in Blueprints and C++

## Fetch History[​](#fetch-history)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

This function fetches historical messages from one or multiple channels. The `IncludeMessageActions` flag also allows you to fetch message actions along with the messages.

It's possible to control how messages are returned and in what order.

- if you specify only the `Start` parameter (without `End`), you will receive messages that are older than the `Start` timetoken

- if you specify only the `End` parameter (without `Start`), you will receive messages from that `End` timetoken and newer

- if you specify values for both `Start` and `End` parameters, you will retrieve messages between those timetokens (inclusive of the `End` value)

You will receive a maximum of 100 messages for a single channel or 25 messages for multiple channels (up to 500). If more messages meet the timetoken criteria, make iterative calls while adjusting the `start` timetoken to fetch the entire list of messages from Message Persistence.

### Method(s)[​](#methods)

- Blueprint
- C++

```
`PubnubSubsystem->FetchHistory(  
    FString Channel,   
    FOnFetchHistoryResponse OnFetchHistoryResponse,   
    FPubnubFetchHistorySettings FetchHistorySettings = FPubnubFetchHistorySettings()  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to get the historical messages of.`OnFetchHistoryResponse` *Type: [`FOnFetchHistoryResponse`](#fonfetchhistoryresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.`FetchHistorySettings`Type: [`FPubnubFetchHistorySettings`](#fpubnubfetchhistorysettings)Struct defining history configuration.
#### FPubnubFetchHistorySettings[​](#fpubnubfetchhistorysettings)
  
*  requiredParameterDescription`MaxPerChannel`Type: intSpecifies the number of historical messages to return. Default and maximum is 100 for a single channel, 25 for multiple channels, and 25 if `IncludeMessageActions` is `true`.`Reverse`Type: boolSetting to `true` will traverse the time line in reverse starting with the oldest message first. Default is `false`.`Start`Type: `FString`Timetoken delimiting the `start` of time slice (exclusive) to pull messages from.`End`Type: `FString`Timetoken delimiting the `end` of time slice (inclusive) to pull messages from.`IncludeMeta`Type: boolWhether meta (passed when Publishing the message) should be included in response or not.`IncludeMessageType`Type: boolPass `true` to receive the message type with each history message. Default is `false`.`IncludeUserID`Type: boolPass `true` to receive the publisher `uuid` with each history message. Default is `false`.`IncludeMessageActions`Type: boolThe flag denoting to retrieve history messages with `message` actions. If `true`, the method is limited to one channel and 25 messages only. Default is `false`.`IncludeCustomMessageType`Type: boolIndicates whether to retrieve messages with the custom message type.  
   
For more information, refer to [Retrieving Messages](/docs/general/storage#retrieve-messages).

### Basic Usage[​](#basic-usage)

##### Reference code

This example is a self-contained code snippet ready to be run. It includes necessary imports and executes methods with console logging. Use it as a reference when working with other examples in this document.

#### MyGameMode.h[​](#mygamemodeh)

```
`// NOTE: This example requires correct PubnubSDK configuration in plugins settings and adding "PubnubLibrary" to PublicDependencyModuleNames in your build.cs  
// More info in the documentation: https://www.pubnub.com/docs/sdks/unreal/api-reference/configuration  
  
#pragma once  
  
#include "CoreMinimal.h"  
#include "GameFramework/GameModeBase.h"  
#include "MyGameMode.generated.h"  
  
/**  
 *   
 */  
UCLASS()  
//Replace MYPROJECT with name of your project  
class MYPROJECT_API AMyGameMode : public AGameModeBase  
`
```
show all 24 lines

#### MyGameMode.cpp[​](#mygamemodecpp)

```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::FetchHistoryExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
  
`
```
show all 40 lines

##### Truncated response

If you fetch messages with messages actions, the number of messages in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to history adjusting the parameters to fetch more messages.

### Returns[​](#returns)

This method returns the [`FOnFetchHistoryResponse`](#fonfetchhistoryresponse) struct.

#### FOnFetchHistoryResponse[​](#fonfetchhistoryresponse)

FieldTypeDescription`Error``bool`Whether the operation resulted in an error.`Status``int`HTTP code of the result of the operation.`ErrorMessage``FString`Detailed information about the error.`Messages``TArray<FPubnubHistoryMessageData>&`An array of [`FPubnubHistoryMessageData`](#fpubnubhistorymessagedata) structs which are the historical messages you wanted to fetch.

#### FPubnubHistoryMessageData[​](#fpubnubhistorymessagedata)

FieldTypeDescription`Message``FString`The message text.`UserID``FString`User ID of the user who sent the message.`Timetoken``FString`Timetoken indicating when the message was sent.`Meta``FString`Additional information.`MessageType``FString`Type of the message. Refer to [Message types](/docs/general/messages/type) for more information.`CustomMessageType``FString`The custom message type associated with the message.`MessageActions``TArray<FPubnubMessageActionData>`An array of [`FPubnubMessageActionData`](#fpubnubmessageactiondata) structs which are [message actions](/docs/general/messages/actions) that were added to the historical messages.

#### FPubnubMessageActionData[​](#fpubnubmessageactiondata)

FieldTypeDescription`Type``FString`Message action type.`Value``FString`Message action value.`UserID``FString`User ID of the user who added the action.`ActionTimetoken``FString`Timetoken indicating when the message action was added.`MessageTimetoken``FString`Timetoken indicating when the message the action was added to had been sent.

#### JSON response[​](#json-response)

```
`{  
  "status": 200,  
  "error": false,  
  "error_message": "",  
  "channels": {  
    "myChannel": [  
      {  
        "message": {  
          "text": "This is a realtime message_1!"  
        },  
        "timetoken": "17181114089437121"  
      },  
      {  
        "message": {  
          "text": "This is a realtime message_2!"  
`
```
show all 33 lines

## Message Counts[​](#message-counts)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Returns the number of messages published on one or more channels since a given time. The count returned is the number of messages in history with a `Timetoken` value greater than or equal to than the passed value in the `Timetoken` parameter.

##### Unlimited message retention

For keys with unlimited message retention enabled, this method considers only messages published in the last 30 days.

### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->MessageCounts(  
    FString Channel,   
    FString Timetoken,   
    FOnPubnubResponse OnMessageCountsResponse)  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to get the message counts of.`Timetoken` *Type: `FString`The timetoken to fetch the message counts from.`OnMessageCountsResponse` *Type: `FOnPubnubResponse`The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

### Basic Usage[​](#basic-usage-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FDateTime TimeStamp = FDateTime::Now();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnPubnubResponse OnMessageCountsResponse;  
OnMessageCountsResponse.BindDynamic(this, &AMyActor::OnMessageCountsResponse);  
  
PubnubSubsystem->MessageCounts(Channel, TimeStamp, OnMessageCountsResponse);  
`
```

### Returns[​](#returns-1)

This method returns an integer that represents the number of messages published on one or more channels since a given time.

```
`5**`
```
Last updated on Jun 10, 2025**