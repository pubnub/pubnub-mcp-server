On this page
# Publish/Subscribe API for Unreal SDK

The foundation of the PubNub service is the ability to send a message and have it delivered anywhere in less than 30ms. Send a message to just one other person, or broadcast to thousands of subscribers at once.

For higher-level conceptual details on publishing and subscribing, refer to [Connection Management](/docs/general/setup/connection-management) and to [Publish Messages](/docs/general/messages/publish).

### Usage in Blueprints and C++

## Publish[​](#publish)

`publish()` sends a message to all channel subscribers. A successfully published message is replicated across PubNub's points of presence and sent simultaneously to all subscribed clients on a channel.

- Prerequisites and limitations
- Message data
- Size
- Publish rate
- Custom message type
- Best practices

- You must [initialize PubNub](/docs/sdks/unreal/api-reference/configuration) with the `publishKey`.

- You don't have to be subscribed to a channel to publish to it.

- You cannot publish to multiple channels simultaneously.

The message can contain any JSON-serializable data (Objects, Arrays, Ints, Strings) and shouldn't contain any special classes or functions. String content can include any single-byte or multi-byte UTF-8 characters.

##### Don't JSON serialize

You should not JSON serialize the `message` and `meta` parameters when sending signals, messages, or files as the serialization is automatic. Pass the full object as the message/meta payload and let PubNub handle everything.

The maximum message size is 32 KiB, including the final escaped character count and the channel name. An optimal message size is under 1800 bytes.

If the message you publish exceeds the configured size, you receive a `Message Too Large` error. If you want to learn more or calculate your payload size, refer to [Message Size Limit](/docs/general/messages/publish#message-size-limit).

You can publish as fast as bandwidth conditions allow. There is a soft limit based on max throughput since messages will be discarded if the subscriber can't keep pace with the publisher.

For example, if 200 messages are published simultaneously before a subscriber has had a chance to receive any, the subscriber may not receive the first 100 messages because the message queue has a limit of only 100 messages stored in memory.

 You can optionally provide the `CustomMessageType` parameter to add your business-specific label or category to the message, for example `text`, `action`, or `poll`. 

- Publish to any given channel in a serial manner (not concurrently).

- Check that the return code is success (for example, `[1,"Sent","136074940..."]`)

- Publish the next message only after receiving a success return code.

- If a failure code is returned (`[0,"blah","<timetoken>"]`), retry the publish.

- Avoid exceeding the in-memory queue's capacity of 100 messages. An overflow situation (aka missed messages) can occur if slow subscribers fail to keep up with the publish pace in a given period of time.

- Throttle publish bursts according to your app's latency needs, for example no more than 5 messages per second.

### Method(s)[​](#methods)

- Blueprint
- C++

```
`PubnubSubsystem->PublishMessage(  
    FString Channel,  
    FString Message,   
    FPubnubPublishSettings PublishSettings = FPubnubPublishSettings()  
);  
`
```
*  requiredParameterDescription`Message` *Type: `FString`The payload.`Channel` *Type: `FString`The channel ID to sent the message to.`PublishSettings`Type: [`FPubnubPublishSettings`](#fpubnubpublishsettings)Struct defining publish configuration.
#### FPubnubPublishSettings[​](#fpubnubpublishsettings)
  
*  requiredParameterDescription`StoreInHistory`Type: boolWhether to store the message so it is available to be returned by the History API. `true` by default.`MetaData`Type: `FString`A JSON object containing additional (meta) data about the message which you can use with the filtering ability.`PublishMethod`Type: `EPubnubPublishMethod`Which HTTP method to use for the publish transaction. Available values:   
   
 
 - `PPM_SendViaGET`
 - `PPM_SendViaPOST`
 - `PPM_UsePATCH`
 - `PPM_SendViaPOSTwithGZIP`
 - `PPM_UsePATCHwithGZIP`
 - `PPM_UseDELETE`
 
`Replicate`Type: boolIf true, the message is replicated and is received by all subscribers. If false, the message is not replicated and is delivered only to Functions event handlers.`CustomMessageType`Type: `FString`A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage)

#### Publish a message to a channel[​](#publish-a-message-to-a-channel)

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
show all 22 lines

#### MyGameMode.cpp[​](#mygamemodecpp)

```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::PublishMessageExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
	FString Message = "{ \"text\" : \"This is my message\" }";  
`
```
show all 23 lines

##### Subscribe to the channel

Before running the above publish example (either using the [Debug Console](https://www.pubnub.com/docs/console/) or in a separate script running in a new terminal window), [subscribe to the same channel](#subscribe) that you publish the message to.

### Returns[​](#returns)

This method doesn't have a return value.

### Other Examples[​](#other-examples)

#### Publish a message using POST with GZIP[​](#publish-a-message-using-post-with-gzip)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString Message = "{ \"text\" : \"This is my message\" }";  
  
// Create the publish settings  
FPubnubPublishSettings PublishSettings;  
PublishSettings.PublishMethod = EPubnubPublishMethod::PPM_SendViaPOSTwithGZIP;  
  
// Publish the message using the specified publish settings  
PubnubSubsystem->PublishMessage(Channel, Message, PublishSettings);  
`
```

## Signal[​](#signal)

The `signal()` function is used to send a signal to all subscribers of a channel.

By default, signals are limited to a message payload size of `64` bytes. This limit applies only to the payload, and not to the URI or headers. If you require a larger payload size, [contact support](mailto:support@pubnub.com).

### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->Signal(  
    FString Channel,   
    FString Message,  
    FPubnubSignalSettings SignalSettings = FPubnubSignalSettings()  
);  
`
```
*  requiredParameterDescription`Message` *Type: `FString`The payload.`Channel` *Type: `FString`The channel ID to sent the signal to.`SignalSettings`Type: [`FPubnubSignalSettings`](#fpubnubsignalsettings)Struct defining signal configuration.
#### FPubnubSignalSettings[​](#fpubnubsignalsettings)
  
*  requiredParameterDescription`CustomMessageType`Type: `FString`A case-sensitive, alphanumeric string from 3 to 50 characters describing the business-specific label or category of the message. Dashes `-` and underscores `_` are allowed. The value cannot start with special characters or the string `pn_` or `pn-`.   
   
 Examples: `text`, `action`, `poll`.

### Basic Usage[​](#basic-usage-1)

#### Signal a message to a channel[​](#signal-a-message-to-a-channel)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString Message = "{ \"text\" : \"This is my signal\" }";  
  
// Create the signal settings  
FPubnubSignalSettings SignalSettings;  
PublishSettings.CustomMessageType = "text-message";  
  
// Send the signal  
PubnubSubsystem->Signal(Channel, Message, SignalSettings);  
`
```
show all 16 lines

### Returns[​](#returns-1)

This method doesn't have a return value.

## Subscribe[​](#subscribe)

### Receive messages[​](#receive-messages)

Your app receives messages and events via event listeners. The event listener is a single point through which your app receives all the messages, signals, and events that are sent in any channel you are subscribed to.

For more information about adding a listener, refer to the [Event Listeners](/docs/sdks/unreal/api-reference/configuration#event-listeners) section.

### Description[​](#description)

This function causes the client to create an open TCP socket to the PubNub Real-Time Network and begin listening for messages on a specified `channel` ID. To subscribe to a `channel` ID, the client must send the appropriate `SubscribeKey` at [initialization](/docs/sdks/unreal/api-reference/configuration#configuration-and-initialization).

By default, a newly subscribed client will only receive messages published to the channel after the `Subscribe()` call completes.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then  **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-2)

- Blueprint
- C++

```
`// subscribe to a channel  
PubnubSubsystem->SubscribeToChannel(FString Channel, FPubnubSubscriptionSettinngs SubscriptionSettings);  
// subscribe to a channel group  
PubnubSubsystem->SubscribeToGroup(FString GroupName, FPubnubSubscriptionSettinngs SubscriptionSettings);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel ID to subscribe to.`GroupName` *Type: `FString`The channel group to subscribe to.`SubscriptionSettings`Type: [`FPubnubSubscriptionSettings`](#fpubnubsubscriptionsettings)Struct defining subscription configuration.
#### FPubnubSubscriptionSettings[​](#fpubnubsubscriptionsettings)
*  requiredParameterDescription`ReceivePresenceEvents`Type: boolWhether to subscribe to [presence events](/docs/general/presence/presence-events).

### Basic Usage[​](#basic-usage-2)

Subscribe to a channel:

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Subscribe  
PubnubSubsystem->SubscribeToChannel(Channel, SubscriptionSettings);  
`
```

##### Event listeners

The response of the call is handled by adding a listener. Refer to the [Event Listeners](/docs/sdks/unreal/api-reference/configuration#event-listeners) section for more details. Listeners should be added before calling the method.

### Returns[​](#returns-2)

This method doesn't have a return value. To receive messages, you must [add a listener](/docs/sdks/unreal/api-reference/configuration#add-listeners).

### Other Examples[​](#other-examples-1)

#### Subscribing with presence[​](#subscribing-with-presence)

##### Requires Presence

This method requires that the Presence add-on is [enabled](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) for your key in the [Admin Portal](https://admin.pubnub.com/).   
  
 For information on how to receive presence events and what those events are, refer to [Presence Events](/docs/general/presence/presence-events#subscribe-to-presence-channel).

For any given channel there is an associated Presence channel. You can subscribe directly to the channel by appending `-pnpres` to the channel name or you can use the subscribe method with the `ReceivePresenceEvents` parameter set to `true`. For more information on presence events, refer to the [Presence](/docs/general/presence/presence-events) section.

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
  
// Create the subscription settings  
FPubnubSubscriptionSettings SubscriptionSettings;  
SubscriptionSettings.ReceivePresenceEvents = true;  
  
// Subscribe  
PubnubSubsystem->SubscribeToChannel(Channel, SubscriptionSettings);  
`
```

##### Response

All presence events are received via a [listener](/docs/sdks/unreal/api-reference/configuration#event-listeners). For more information on the structure of the received events, refer to [Event types](/docs/sdks/unreal/api-reference/configuration#presence).

#### Wildcard subscribe to channels[​](#wildcard-subscribe-to-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/) (with Enable Wildcard Subscribe checked). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

Wildcard subscribes allow the client to subscribe to multiple channels using wildcard. For example, if you subscribe to `a.*` you will get all messages for `a.b`, `a.c`, `a.x`. The wildcarded `*` portion refers to any portion of the channel string name after the `dot (.)`.

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "foo.*";  
  
// Subscribe  
PubnubSubsystem->Subscribe(Channel);  
`
```

##### Wildcard grants and revokes

Only one level (`a.*`) of wildcarding is supported. If you grant on `*` or `a.b.*`, the grant will treat `*` or `a.b.*` as a single channel named either `*` or `a.b.*`. You can also revoke permissions from multiple channels using wildcards but only if you previously granted permissions using the same wildcards. Wildcard revokes, similarly to grants, only work one level deep, like `a.*`.

## Unsubscribe[​](#unsubscribe)

When subscribed to a single channel, this function causes the client to issue a `leave` from the `channel` ID and close any open socket to the PubNub Network. For multiplexed channels, the specified `channel`(s) will be removed and the socket remains open until there are no more channels remaining in the list.

##### Unsubscribing from all channels

**Unsubscribing** from all channels, and then **subscribing** to a new channel Y is not the same as subscribing to channel Y and then unsubscribing from the previously-subscribed channel(s). Unsubscribing from all channels resets the last-received `timetoken` and thus, there could be some gaps in the subscription that may lead to message loss.

### Method(s)[​](#methods-3)

- Blueprint
- C++

```
`// unsubscribe from a channel  
PubnubSubsystem->UnsubscribeFromChannel(FString Channel);  
// unsubscribe from a channel group  
PubnubSubsystem->UnsubscribeFromGroup(FString GroupName);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel ID to unsubscribe from.`GroupName` *Type: `FString`The channel group to unsubscribe from.

### Basic Usage[​](#basic-usage-3)

Unsubscribe from a channel:

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChannelGroupName = "randomChannelGroup";  
  
// Subscribe  
PubnubSubsystem->Subscribe(Channel);  
PubnubSubsystem->SubscribeToGroup(ChannelGroupName);  
  
// Unsubscribe  
PubnubSubsystem->UnsubscribeFromChannel(Channel);  
`
```
show all 16 lines

### Returns[​](#returns-3)

This method doesn't have a return value.

## Unsubscribe All[​](#unsubscribe-all)

Unsubscribe from all channels and all channel groups.

### Method(s)[​](#methods-4)

- Blueprint
- C++

```
`PubnubSubsystem->UnsubscribeFromAll();  
`
```

### Basic Usage[​](#basic-usage-4)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChannelGroupName = "randomChannelGroup";  
  
// Subscribe  
PubnubSubsystem->Subscribe(Channel);  
PubnubSubsystem->SubscribeToGroup(ChannelGroupName);  
  
// Unsubscribe all  
PubnubSubsystem->UnsubscribeFromAll();  
`
```

### Returns[​](#returns-4)

This method doesn't have a return value.
Last updated on **Jun 16, 2025**