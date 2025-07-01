On this page
# Channel Groups API for Unreal SDK

[Channel groups](/docs/general/channels/subscribe#channel-groups) allow PubNub developers to bundle thousands of [channels](/docs/general/channels/overview) into a group that can be identified by a name. These channel groups can then be subscribed to, receiving data from the many back-end channels the channel group contains.

##### Channel group operations

You can't publish to a channel group. You can only subscribe to it. To publish within the channel group, you need to publish to each channel individually.

### Usage in Blueprints and C++

## Add Channels[​](#add-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function adds a channel to a channel group.

### Method(s)[​](#methods)

`Adding Channels` is accomplished by using the following method(s) in the Unreal SDK:

##### Maximum number of channels

`200 channels` can be added to the `channel group` per API call.

- Blueprint
- C++

```
`PubnubSubsystem->AddChannelToGroup(  
    FString Channel,   
    FString ChannelGroup  
);  
`
```
*  requiredParameterDescription`Channel` *Type: `FString`The channel to add to the channel group.`ChannelGroup` *Type: `FString`The channel group to add the channels to.

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
show all 21 lines

#### MyGameMode.cpp[​](#mygamemodecpp)

```
`#include "MyGameMode.h"  
#include "PubnubSubsystem.h"  
#include "Kismet/GameplayStatics.h"  
  
void AMyGameMode::AddChannelToGroupExample()  
{  
	// Get PubnubSubsystem from the game instance  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
	// Ensure user ID is set  
	PubnubSubsystem->SetUserID("my_user_id");  
  
	FString Channel = "randomChannel";  
	FString ChannelGroup = "myChannelGroup";  
`
```
show all 20 lines

### Returns[​](#returns)

This method doesn't have any return value.

## List Channels[​](#list-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function lists all the channels of the channel group.

### Method(s)[​](#methods-1)

- Blueprint
- C++

```
`PubnubSubsystem->ListChannelsFromGroup(  
    FString ChannelGroup,   
    FOnListChannelsFromGroupResponse OnListChannelsResponse  
);  
`
```
*  requiredParameterDescription`ChannelGroup` *Type: `FString`The channel group to list the channels of.`OnListChannelsResponse` *Type: [`FOnListChannelsFromGroupResponse`](#fonlistchannelsfromgroupresponse)The [callback function](/docs/sdks/unreal/api-reference/configuration#add-callback-function) used to handle the result.

### Basic Usage[​](#basic-usage-1)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChannelGroup = "myChannelGroup";  
  
// Create a pubnub response delegate  
// you MUST implement your own callback function to handle the response  
FOnListChannelsFromGroupResponse OnListChannelsResponse;  
OnListChannelsResponse.BindDynamic(this, &AMyActor::OnListChannelsResponse);  
  
// Add channel to channel group  
`
```
show all 16 lines

### Returns[​](#returns-1)

This method returns the [`FOnListChannelsFromGroupResponse`](#fonlistchannelsfromgroupresponse) struct.

#### FOnListChannelsFromGroupResponse[​](#fonlistchannelsfromgroupresponse)

  

FieldTypeDescription`Error``bool`Whether the operation resulted in an error.`Status``int`HTTP code of the result of the operation.`Channels``TArray<FString>&`An array of channel names of all the channels of the channel group.

#### JSON response[​](#json-response)

```
`{  
  "error":false,  
  "payload":{  
    "channels":[],  
    "group":"my_channel"  
  },  
  "service":"channel-registry",  
  "status":200  
}  
`
```

## Remove Channels[​](#remove-channels)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channels from the channel group.

### Method(s)[​](#methods-2)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveChannelFromGroup(  
    FString Channel,   
    FString ChannelGroup  
);  
`
```
*  requiredParameterDescription`ChannelGroup` *Type: `FString`The channel group to remove the channel from.`Channel` *Type: `FString`The channel to remove from the channel group.

### Basic Usage[​](#basic-usage-2)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString Channel = "randomChannel";  
FString ChanelGroup = "myChannelGroup";  
  
// Remove channel from channel group  
PubnubSubsystem->RemoveChannelFromGroup(Channel, ChannelGroup);  
`
```

### Returns[​](#returns-2)

This method doesn't have any return value.

## Delete Channel Group[​](#delete-channel-group)

##### Requires Stream Controller add-on

This method requires that the *Stream Controller* add-on is enabled for your key in the [Admin Portal](https://admin.pubnub.com/). Read the [support page](https://support.pubnub.com/hc/en-us/articles/360051974791-How-do-I-enable-add-on-features-for-my-keys-) on enabling add-on features on your keys.

This function removes the channel group.

### Method(s)[​](#methods-3)

- Blueprint
- C++

```
`PubnubSubsystem->RemoveChannelGroup(  
    String ChannelGroup  
);  
`
```
*  requiredParameterDescription`ChannelGroup` *Type: `FString`The channel group to remove.

### Basic Usage[​](#basic-usage-3)

```
`#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  
  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
  
FString ChanelGroup = "myChannelGroup";  
  
// Remove channel group  
PubnubSubsystem->RemoveChannelGroup(ChannelGroup);  
`
```

### Returns[​](#returns-3)

This method doesn't have any return value.
Last updated on **Apr 29, 2025**