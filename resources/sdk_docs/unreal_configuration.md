On this page
# Configuration API for Unreal SDK

Unreal complete API reference for building real-time applications on PubNub, including basic usage and sample code.

## Configuration and Initialization[​](#configuration-and-initialization)

You can configure the PubNub SDK in Unreal Editor as follows:

In the Unreal Editor window, click the **Settings** dropdown and select **Project Settings**.

In the **Project Settings** window, scroll down to the **Plugins** section and click **Pubnub SDK**. The **Plugins - Pubnub SDK** view opens.

In the **Plugins - Pubnub SDK** view, provide the desired values for the available configuration options.

*  requiredPropertyDescriptionPublish KeyType: stringPublish Key from [Admin Portal](https://admin.pubnub.com/) (only required if publishing).Subscribe Key *Type: stringSubscribe Key from [Admin Portal](https://admin.pubnub.com/).Secret KeyType: stringSecret Key from [Admin Portal](https://admin.pubnub.com/), only required for access control operations.Initialize AutomaticallyType: BooleanWhether to initialize the SDK without having to invoke the `Init Pubnub` command.Set Secret Key AutomaticallyType: BooleanWhether to initialize the SDK with the provided secret key without having to invoke the `Set Secret Key` command.

### Basic Usage[​](#basic-usage)

### Usage in Blueprints and C++

  

##### Required User ID

Always set the User ID to uniquely identify the user or device that connects to PubNub. This User ID should be persisted, and should remain unchanged for the lifetime of the user or the device. If you don't set the User ID, you won't be able to connect to PubNub.

- Project settings
- Blueprint

## Event Listeners[​](#event-listeners)

In PubNub Unreal SDK, the listeners notify you of message events and errors. All events emitted on a particular channel are received through `OnMessageReceived` but differ in their JSON payload. Refer to [Event types](#event-types) for more information.

### Add Listeners[​](#add-listeners)

- Blueprint
- C++

Actor.h
```
`// ...other code...  
  
public:	  
  // message and signal listener definition in header  
  UFUNCTION(BlueprintCallable)  
  void OnPubnubMessageReceived(FString MessageJson, FString Channel);  
  
  // error handler  
  UFUNCTION(BlueprintCallable)  
  void OnPubnubErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType);  
  
// ...other code...  
`
```
Actor.cpp
```
`// ...other code...  
void MyGameInstance::BeginPlay()  
{  
	Super::BeginPlay();  
    UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
    PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
    // set the user ID  
    PubnubSubsystem->SetUserID("unreal_sdk");  
    // bind the message and signal listener definition in header  
    // to its logic in MyGameInstance class (below)  
    PubnubSubsystem->OnMessageReceived.AddDynamic(this, &MyGameInstance::OnPubnubMessageReceived);  
    // bind the error handler definition in header  
    // to its logic in MyGameInstance class (below)  
    PubnubSubsystem->OnPubnubError.AddDynamic(this, &MyGameInstance::OnPubnubErrorReceived);  
      
`
```
show all 32 lines

### Add Subscription Status Listener[​](#add-subscription-status-listener)

You need to add a subscription status listener to get notified when the subscription status changes. For more information on subscriptions, refer to [SDK Connection Lifecycle](/docs/general/setup/connection-management#sdk-connection-lifecycle).

- Blueprint
- C++

Actor.h
```
`// ...other code...  
void RegisterSubscriptionListener();  
UFUNCTION()  
void OnSubscriptionStatusChanged(EPubnubSubscriptionStatus Status, const FPubnubSubscriptionStatusData& StatusData);  
// ...other code...  
`
```
Actor.cpp
```
`// ...other code  
void AMyActor::RegisterSubscriptionListener()  
{  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  
	  
	PubnubSubsystem->OnSubscriptionStatusChanged.AddDynamic(this, &AMyActor::OnSubscriptionStatusChanged);  
}  
  
void AMyActor::OnSubscriptionStatusChanged(EPubnubSubscriptionStatus Status, const FPubnubSubscriptionStatusData& StatusData)  
{  
	//Do something with status changed  
}  
`
```

### Add Callback Function[​](#add-callback-function)

Responses to functions are handled using response delegates and callback functions.

All functions with a response type need a callback function to handle the response. Let's look into an example implementation of a callback function for the `ListUsersFromChannel` function.

- Blueprint
- C++

Actor.h
```
`// ...other code...  
  
public:	  
  void YourFunction();  
  UFUNCTION()  
  void OnResponse(FString JsonResponse);  
  
// ...other code...  
`
```
Actor.cpp
```
`// ...other code...  
void AMyActor::YourFunction()  
{  
  // define the callback and bind the OnResponse function from header  
  // to its implementation in the AActor class (below)  
  FOnListUsersFromChannelResponse OnListUsersFromChannelResponse;  
  OnListUsersFromChannelResponse.BindDynamic(this, &AMyActor::OnResponse);  
    
  // Create the list users settings  
  FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings;  
  ListUsersFromChannelSettings.DisableUserID = false;  
  ListUsersFromChannelSettings.State = true;  
  
  PubnubSubsystem->ListUsersFromChannel(Channel, OnListUsersFromChannelResponse, ListUsersFromChannelSettings);  
    
`
```
show all 25 lines

## Event Types[​](#event-types)

All message events are routed through `OnMessageReceived` but have a different JSON structure. The following list shows examples of the event payload emitted for different event types.

### Objects[​](#objects)

#### Set User Metadata[​](#set-user-metadata)

```
`{  
  "source": "objects",  
  "version": "2.0",  
  "event": "set",  
  "type": "uuid",  
  "data": {  
    "eTag": "dad3f3d77ec74a6458b34e0ee5172544",  
    "id": "User1",  
    "name": "new name",  
    "updated": "2024-08-12T06:37:16.441347Z"  
  }  
}  
`
```

#### Set Channel Metadata[​](#set-channel-metadata)

```
`{  
  "source": "objects",  
  "version": "2.0",  
  "event": "set",  
  "type": "channel",  
  "data": {  
    "eTag": "cdfd462ffc3a985470fd309810a05f0b",  
    "id": "my_channel2",  
    "name": "new channel name",  
    "updated": "2024-08-12T06:39:50.16522Z"  
  }  
}  
`
```

#### Set Member[​](#set-member)

```
`{  
  "source": "objects",  
  "version": "2.0",  
  "event": "set",  
  "type": "membership",  
  "data": {  
    "channel": {  
      "id": "my_ue_channel"  
    },  
    "eTag": "Afah2qS199e74QE",  
    "updated": "2024-08-12T13:15:47.057904689Z",  
    "uuid": {  
      "id": "User11"  
    }  
  }  
`
```
show all 16 lines

#### Set Membership[​](#set-membership)

```
`{  
  "source": "objects",  
  "version": "2.0",  
  "event": "set",  
  "type": "membership",  
  "data": {  
    "channel": {  
      "id": "channel_from_ue"  
    },  
    "eTag": "Afah2qS199e74QE",  
    "updated": "2024-08-12T13:17:22.756243015Z",  
    "uuid": {  
      "id": "User12"  
    }  
  }  
`
```
show all 16 lines

### Presence[​](#presence)

#### Presence Join[​](#presence-join)

```
`{  
    "Event": "join",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 2,  
    "State": null,  
    "Channel":" my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

#### Presence Leave[​](#presence-leave)

```
`{  
    "Event": "leave",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 1,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

#### Presence Timeout[​](#presence-timeout)

```
`{  
    "Event": "timeout",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 0,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

#### State Change Event[​](#state-change-event)

```
`{  
    "Event": "state-change",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 1,  
    "State": {  
        "isTyping": true  
    },  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
`
```
show all 17 lines

#### Presence Interval[​](#presence-interval)

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": 1345546797,  
    "Occupancy": 2,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

When a channel is in interval mode with `presence_deltas` `pnconfig` flag enabled, the interval message may also include the following fields which contain an array of changed User IDs since the last interval message.

- joined

- left

- timedout

For example, this interval message indicates there were 2 new User IDs that joined and 1 timed out User ID since the last interval:

```
`{  
    "Event": "interval",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": ,  
    "Occupancy": ,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": ["uuid2", "uuid3"],  
    "Timeout": ["uuid1"],  
    "Leave": null,  
    "HereNowRefresh": false  
}  
`
```

If the full interval message is greater than `30KB` (since the max publish payload is `∼32KB`), none of the extra fields will be present. Instead there will be a `here_now_refresh` boolean field set to `true`. This indicates to the user that they should do a `hereNow` request to get the complete list of users present in the channel.

```
`{**    "Event": "interval",  
    "Uuid": "175c2c67-b2a9-470d-8f4b-1db94f90e39e",  
    "Timestamp": ,  
    "Occupancy": ,  
    "State": null,  
    "Channel": "my_channel",  
    "Subscription": "",  
    "Timetoken": 15034141109823424,  
    "UserMetadata": null,  
    "Join": null,  
    "Timeout": null,  
    "Leave": null,  
    "HereNowRefresh": true  
}  
`
```
Last updated on Jun 16, 2025**