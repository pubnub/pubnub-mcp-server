On this page
# Message Actions API for Unreal SDK

Add or remove actions on published messages to build features like receipts, reactions, or to associate custom metadata to messages. Clients can subscribe to a channel to receive message action events on that channel. They can also fetch past message actions from Message Persistence independently or when they fetch original messages.

### Usage in Blueprints and C++

##### Message Actions vs. Message Reactions

**Message Actions** is the flexible, low-level API for adding any metadata to messages (read receipts, delivery confirmations, custom data), while **Message Reactions** specifically refers to using Message Actions for emoji/social reactions.

In PubNub [Core](/docs/sdks) and [Chat](/docs/chat/overview) SDKs, the same underlying Message Actions API is referred to as **Message Reactions** when used for emoji reactions - it's the same functionality, just different terminology depending on the use case.

## Add Message Action[​](#add-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Add a action to a published message.

### Method(s)[​](#methods)

- Blueprint
- C++

```
`PubnubSubsystem->AddMessageAction(  
    FString Channel,   
    FString MessageTimeToken,   
    EPubnubActionType ActionType,    
    FString Value,  
    FOnAddMessageActionsResponse OnAddMessageActionResponse  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to publish the message action to.`MessageTimeToken` *Type: `FString`The timetoken of a published message to apply the action to.`ActionType` *Type: `EPubnubActionType`Enum action type. Available values:   
 
- `pbactypReaction`
- `pbactypReceipt`
- `pbactypCustom`
- `pbactypEdited`
- `pbactypDeleted`

`Value` *Type: `FString`A String describing the action to be added.`OnAddMessageActionResponse` *Type: [`FOnAddMessageActionsResponse`](#fonaddmessageactionsresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

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
  
void AMyGameMode::AddMessageReactionExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
	FString MessageTimeToken = "5610547826969050";  
`
```
show all 30 lines

### Returns[​](#returns)

This method returns the [`FOnAddMessageActionsResponse`](#fonaddmessageactionsresponse) struct.

#### FOnAddMessageActionsResponse[​](#fonaddmessageactionsresponse)

FieldTypeDescription`MessageActionTimetoken``FString`Timetoken indicating when the message action was added.

## Remove Message Action[​](#remove-message-action)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Remove a previously added action from a published message. Returns an empty response.

### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveMessageAction(  
    FString Channel,   
    FString MessageTimeToken,   
    FString ActionTimeToken  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel the message action was published to.`MessageTimeToken` *Type: `FString`The timetoken of a published message to delete the action of.`ActionTimeToken` *Type: `FString`The timetoken of the published action to delete.

### Basic Usage[​](#basic-usage-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString MessageTimeToken = "5610547826969050";  
FString MessageTimeToken = "15610547826970050";  
  
// Add the message action  
PubnubSubsystem->RemoveMessageAction(Channel, MessageTimeToken, ActionTimeToken);  
`
```

### Returns[​](#returns-1)

This method doesn't have any return value.

## Get Message Actions[​](#get-message-actions)

##### Requires Message Persistence

This method requires that Message Persistence is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).

Get a list of message actions in a `channel`. Returns a list of actions sorted by the action's timetoken in ascending order.

##### Truncated response

Number of message actions in the response may be truncated when internal limits are hit. If the response is truncated, a `more` property will be returned with additional parameters. Send iterative calls to Message Persistence adjusting the parameters to fetch more message actions.

### Method(s)[​](#methods-2)

- Blueprint
- C++

```
`PubnubSubsystem->GetMessageActions(  
    FString Channel,   
    FString Start,   
    FString End,   
    int SizeLimit,   
    FOnGetMessageActionsResponse OnGetMessageActionsResponse  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel the message action was published to.`Start`Type: `FString`Previously-returned cursor bookmark for fetching the next page. Use `""` if you don’t want to paginate with a start bookmark.`End`Type: `FString`Previously-returned cursor bookmark for fetching the previous page. Ignored if you also supply the start parameter. Use `""` if you don’t want to paginate with an end bookmark.`SizeLimit`Type: intNumber of objects to return in response. Available values: `1` - `100`. If you set `0`, the default value of `100` is used.`OnGetMessageActionsResponse` *Type: [`FOnGetMessageActionsResponse`](#fongetmessageactionsresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

### Basic Usage[​](#basic-usage-2)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnGetMessageActionsResponse OnGetMessageActionsResponse;  
OnGetMessageActionsResponse.BindDynamic(this, &AMyActor::OnGetMessageActionsResponse);  
  
FString Channel = "randomChannel";  
FString Start = "";  
FString End = "";  
  
`
```
show all 17 lines

### Returns[​](#returns-2)

This method returns the [`FOnGetMessageActionsResponse`](#fongetmessageactionsresponse) struct.

#### FOnGetMessageActionsResponse[​](#fongetmessageactionsresponse)

  

FieldTypeDescription`Status``int`HTTP code of the result of the operation.`MessageActions``TArray<FPubnubMessageActionData>&`An array of [`FPubnubMessageActionData`](/docs/sdks/unreal/api-reference/storage-and-playback#fpubnubmessageactiondata) structs which are the message actions sent on a given channel.

#### JSON Response[​](#json-response)

```
`{  
  "status": 200,   
  "data": [{  
    "messageTimetoken": "17198286823798098",   
    "type": "reaction",   
    "uuid": "User1",   
    "value": "happy",   
    "actionTimetoken": "17198286996058878"  
  }]  
}  
`
```

## History with Message Actions[​](#history-with-message-actions)

You can choose to return message actions when fetching historical message. Refer to [Fetch History](/docs/sdks/unreal/api-reference/storage-and-playback#fetch-history) for more details.
Last updated on **Jun 10, 2025**