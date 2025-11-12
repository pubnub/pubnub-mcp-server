# Configuration API for Unreal SDK

Concise reference for configuring, initializing, and using PubNub in Unreal via Project Settings, Blueprints, and C++.

## Configuration and initialization

- Project settings
- C++

### Project Settings

Unreal Editor > Settings > Project Settings > Plugins > Pubnub SDK

Provide values for:

- Publish Key
  - Type: string
  - Publish Key from Admin Portal (required if publishing).
- Subscribe Key
  - Type: string
  - Subscribe Key from Admin Portal.
- Secret Key
  - Type: string
  - Secret Key from Admin Portal (only required for access control). If set with “Set Secret Key Automatically,” the user gets root Access Manager permissions.
- Initialize Automatically
  - Type: Boolean
  - Initialize the SDK without calling Init Pubnub. Disable to use InitPubnubWithConfig().
- Set Secret Key Automatically
  - Type: Boolean (Project Settings only)
  - Initialize the SDK using the provided Secret Key without calling Set Secret Key.

##### Must disable automatic initialization

You can only use InitPubnubWithConfig() if Initialize Automatically is disabled in Project Settings.

```
PubnubSubsystem->InitPubnubWithConfig(FPubnubConfig);
```

### FPubnubConfig

Configuration struct for the PubNub SDK.

- PublishKey
  - Type: FString
  - Default: "demo"
  - Publish Key from Admin Portal (required if publishing).
- SubscribeKey
  - Type: FString
  - Default: "demo"
  - Subscribe Key from Admin Portal.
- SecretKey
  - Type: FString
  - Default: ""
  - Secret Key for access control. When set, grants root Access Manager permissions. To use it, set SetSecretKeyAutomatically to true or call SetSecretKey.
- UserID
  - Type: FString
  - Default: ""
  - Required for all operations; set before first operation if empty. UTF-8, up to 92 alphanumeric characters.
- SetSecretKeyAutomatically
  - Type: bool
  - Default: false
  - If true, SecretKey will be set during initialization (grants root Access Manager permissions).

### Sample code

Add a C++ dependency on PubnubLibrary:

```
PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });
```

Access the subsystem and call SDK functions:

```
#include "Kismet/GameplayStatics.h"
#include "PubnubSubsystem.h"

UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystem<UPubnubSubsystem>();
```

Example:

```
PubnubSubsystem->SubscribeToChannel("MyChannel");
```

### Usage in Blueprints and C++

- Blueprints: Use the Pubnub Subsystem node to access SDK functionality.
- C++: Use UPubnubSubsystem via the Game Instance Subsystem.

##### Required User ID

Always set and persist a stable User ID for the lifetime of the user/device. If not set in config, call SetUserID before any operation.