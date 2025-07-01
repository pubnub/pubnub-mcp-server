# PubNub Unreal SDK – Configuration (Condensed)

## Configuration and Initialization  

Configure the SDK in Project Settings → Plugins → **PubNub SDK**.

Configuration options (all optional unless noted):

| Setting | Type | Purpose |
|---|---|---|
| **Publish Key** | string | Key from the Admin Portal; required for publishing. |
| **Subscribe Key** | string | Key from the Admin Portal; required for subscribing. |
| **Secret Key** | string | Needed only for access-control operations. |
| **Initialize Automatically** | bool | Auto-calls `Init Pubnub`. |
| **Set Secret Key Automatically** | bool | Auto-calls `Set Secret Key`. |

Always set a unique, persistent **User ID** before connecting.

---

## Event Listeners  

All channel events arrive through `OnMessageReceived`; errors through `OnPubnubError`.  

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

### Subscription Status Listener  

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

### Callback Example (ListUsersFromChannel)  

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

---

## Event Payload Samples  

All below are returned through `OnMessageReceived`.

### Objects  

#### Set User Metadata
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

#### Set Channel Metadata
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

#### Set Member
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

#### Set Membership
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

### Presence  

Presence events contain fields: `Event`, `Uuid`, `Timestamp`, `Occupancy`, `State`, `Channel`, `Subscription`, `Timetoken`, `UserMetadata`, `Join`, `Timeout`, `Leave`, `HereNowRefresh`.

#### Join
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

#### Leave
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

#### Timeout
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

#### State-Change
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

#### Interval (with deltas)
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

#### Interval (payload > 30 KB)
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

_Last updated Jun 16 2025_