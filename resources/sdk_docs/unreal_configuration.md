# PubNub Unreal SDK – Configuration & Essential Usage

## 1. Plugin Settings (Edit → Project Settings → Plugins → PubNub SDK)

| Property | Type | Purpose |
|----------|------|---------|
| **Publish Key** | `string` | From Admin Portal; required for publish. |
| **Subscribe Key** | `string` | From Admin Portal; required for all operations. |
| **Secret Key** | `string` | From Admin Portal; only for Access Manager. |
| **Initialize Automatically** | `bool` | Calls `Init Pubnub` at startup. |
| **Set Secret Key Automatically** | `bool` | Calls `Set Secret Key` at startup. |

## 2. Required User ID
Always set a unique, persistent User ID before any PubNub call; otherwise the client cannot connect.

## 3. Sample Usage (Blueprint / C++)

Actor.h
```
// ...other code...  
  
public:	  
  // message and signal listener definition in header  
  UFUNCTION(BlueprintCallable)  
  void OnPubnubMessageReceived(FString MessageJson, FString Channel);  
  
  // error handler  
  UFUNCTION(BlueprintCallable)  
  void OnPubnubErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType);  
  
// ...other code...  
```

Actor.cpp
```
// ...other code...  
void MyGameInstance::BeginPlay()  
{  
	Super::BeginPlay();  
    UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
    PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();  
    // set the user ID  
    PubnubSubsystem->SetUserID("unreal_sdk");  
    // bind the message and signal listener  
    PubnubSubsystem->OnMessageReceived.AddDynamic(this, &MyGameInstance::OnPubnubMessageReceived);  
    // bind the error handler  
    PubnubSubsystem->OnPubnubError.AddDynamic(this, &MyGameInstance::OnPubnubErrorReceived);  
}  
```

## 4. Subscription-Status Listener

Actor.h
```
// ...other code...  
void RegisterSubscriptionListener();  
UFUNCTION()  
void OnSubscriptionStatusChanged(EPubnubSubscriptionStatus Status, const FPubnubSubscriptionStatusData& StatusData);  
// ...other code...  
```

Actor.cpp
```
// ...other code  
void AMyActor::RegisterSubscriptionListener()  
{  
	UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
	UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();  
	PubnubSubsystem->OnSubscriptionStatusChanged.AddDynamic(this, &AMyActor::OnSubscriptionStatusChanged);  
}  
  
void AMyActor::OnSubscriptionStatusChanged(EPubnubSubscriptionStatus Status, const FPubnubSubscriptionStatusData& StatusData)  
{  
	// Do something with status change  
}  
```

## 5. Callback Pattern Example

Actor.h
```
// ...other code...  
  
public:	  
  void YourFunction();  
  UFUNCTION()  
  void OnResponse(FString JsonResponse);  
  
// ...other code...  
```

Actor.cpp
```
// ...other code...  
void AMyActor::YourFunction()  
{  
  FOnListUsersFromChannelResponse OnListUsersFromChannelResponse;  
  OnListUsersFromChannelResponse.BindDynamic(this, &AMyActor::OnResponse);  
    
  FPubnubListUsersFromChannelSettings ListUsersFromChannelSettings;  
  ListUsersFromChannelSettings.DisableUserID = false;  
  ListUsersFromChannelSettings.State = true;  
  
  PubnubSubsystem->ListUsersFromChannel(Channel, OnListUsersFromChannelResponse, ListUsersFromChannelSettings);  
}  
```

---

## 6. Event Payload Samples

### Objects API

Set user metadata
```
{  
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
```

Set channel metadata
```
{  
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
```

Set member
```
{  
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
}
```

Set membership
```
{  
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
}
```

### Presence Events

Presence join
```
{  
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
```

Presence leave
```
{  
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
```

Presence timeout
```
{  
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
```

State change
```
{  
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
    "UserMetadata": null  
}
```

Presence interval
```
{  
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
```

Interval with deltas
```
{  
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
```

Large interval payload
```
{  
    "Event": "interval",  
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
```

_Last updated: Jul 15 2025_