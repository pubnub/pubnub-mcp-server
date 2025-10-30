# Configuration API for Unreal SDK (Condensed)

Essential configuration, initialization, and setup details for PubNub Unreal SDK. All code blocks and critical technical details preserved.

## Configuration and initialization

- Project settings
- C++

Configure in Unreal Editor:
- Settings > Project Settings > Plugins > Pubnub SDK
- Options:
  - Publish Key
    - Type: string
    - Publish Key from Admin Portal (only required if publishing).
  - Subscribe Key
    - Type: string
    - Subscribe Key from Admin Portal.
  - Secret Key
    - Type: string
    - Secret Key from Admin Portal, only required for access control operations.
  - Initialize Automatically
    - Type: Boolean
    - Whether to initialize the SDK without calling the Init Pubnub method. Disable this if you want to use the InitPubnubWithConfig() method.
  - Set Secret Key Automatically
    - Type: Boolean (Only in Project Settings)
    - Whether to initialize the SDK with the provided secret key without calling the Set Secret Key method.
    - If the Secret Key is set and you enable Set Secret Key Automatically, the user will have root permissions for Access Manager.

##### Must disable automatic initialization
You can only use the InitPubnubWithConfig() method if Initialize Automatically is disabled in the project settings.

```
`1PubnubSubsystem->InitPubnubWithConfig(FPubnubConfig);  
`
```

PropertyDescription
- FPubnubConfig
  - Type: FPubnubConfig
  - Default: n/a
  - Configuration struct for the PubNub SDK. Contains the following properties.
  - PublishKey
    - Type: FString
    - Default: "demo"
    - Publish Key from Admin Portal (only required if publishing).
  - SubscribeKey
    - Type: FString
    - Default: "demo"
    - Subscribe Key from Admin Portal.
  - SecretKey
    - Type: FString
    - Default: ""
    - Secret Key from Admin Portal, only required for access control operations. When set, it gives user root permissions for Access Manager. To use it, set SetSecretKeyAutomatically to true or call SetSecretKey function.
  - UserID
    - Type: FString
    - Default: ""
    - Identifies the user or device that connects to PubNub. Required for all operations. If left empty, use SetUserID before the first operation. Must be a UTF-8 encoded string up to 92 alphanumeric characters.
  - SetSecretKeyAutomatically
    - Type: bool
    - Default: false
    - If true, the SecretKey will be set during the initialization phase. Grants root permissions for Access Manager.

### Sample code

##### Reference code
Use PubNub via Blueprints or directly in C++.

In C++, add a dependency to PubnubLibrary in Source/_{YourProject}_/_{YourProject}_.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

In C++, use the PubNub SDK as any other Game Instance Subsystem:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Call SDK functions, for example:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

##### Required User ID
Always set the User ID to uniquely identify the user or device that connects to PubNub. Persist it for the lifetime of the user/device. If not set, you cannot connect to PubNub.

- C++
- Project settings
- Blueprint

#### Actor.h

```
1
  

```

#### Actor.cpp

```
1
  

```