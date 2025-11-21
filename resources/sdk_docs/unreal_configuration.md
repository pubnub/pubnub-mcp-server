# Configuration API for Unreal SDK

Concise reference for configuring and initializing the PubNub Unreal SDK, with essential settings, initialization methods, and minimal examples.

## Configuration and initialization

- Project settings
- C++

Configure in Unreal Editor:

- Settings > Project Settings > Plugins > Pubnub SDK.
- Set these options:
  - Publish Key
    - Type: string
    - From Admin Portal. Required for publishing.
  - Subscribe Key
    - Type: string
    - From Admin Portal.
  - Secret Key
    - Type: string
    - From Admin Portal. Only for Access Manager (grants root permissions when active).
  - Initialize Automatically
    - Type: boolean
    - If enabled, SDK initializes without calling Init Pubnub. Disable to use InitPubnubWithConfig().
  - Set Secret Key Automatically
    - Type: boolean
    - Only in Project Settings. If enabled and Secret Key is set, SDK sets the Secret Key on init. Grants root Access Manager permissions.

##### Must disable automatic initialization

You can only use the `InitPubnubWithConfig()` method if `Initialize Automatically` is disabled in the project settings.

```
`1PubnubSubsystem->InitPubnubWithConfig(FPubnubConfig);  
`
```

Properties for initialization:

- FPubnubConfig
  - Type: FPubnubConfig
  - Configuration struct for the PubNub SDK. Properties:
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
      - Secret Key from Admin Portal, only required for access control operations. When set, it gives user root permissions for Access Manager. To use it, set SetSecretKeyAutomatically to true or call SetSecretKey.
    - UserID
      - Type: FString
      - Default: ""
      - Identifies the user or device that connects to PubNub. Required for all operations. If left empty, use SetUserID before the first operation. Must be a UTF-8 encoded string up to 92 alphanumeric characters.
    - SetSecretKeyAutomatically
      - Type: bool
      - Default: false
      - If true, SecretKey will be set during initialization. Grants root permissions for Access Manager.

### Sample code

Add C++ dependency:

In Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Get the subsystem and use the SDK:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example call:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

### Usage in Blueprints and C++

- In Blueprints, use the Pubnub Subsystem node.
- In C++, access via Game Instance Subsystem as shown above.

##### Required User ID

Always set a stable User ID. If not set, you cannot connect. Persist it for the user/device lifetime.

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

## Encryption

- CryptoModule handles message encryption/decryption. Disabled by default.
- Implementations:
  - UPubnubAesCryptor (AES-256-CBC) – recommended.
  - UPubnubLegacyCryptor – for backward compatibility.
- To use, configure CryptoModule; then publishes are encrypted and incoming messages are decrypted. For usage details, see the Encryption API reference.