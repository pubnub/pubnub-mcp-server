# Configuration API for Unreal SDK (Condensed)

Complete reference for configuring and initializing the PubNub Unreal SDK using Project Settings or C++ with essential details and working examples.

## Configuration and initialization

- Project settings
- C++

Configure in Unreal Editor:
- Settings > Project Settings > Plugins > Pubnub SDK
- Options:
  - Publish Key (string): Publish Key from Admin Portal (required if publishing).
  - Subscribe Key (string): Subscribe Key from Admin Portal.
  - Secret Key (string): Secret Key from Admin Portal; required for access control. If set and Set Secret Key Automatically is enabled, grants root permissions for Access Manager.
  - Initialize Automatically (bool): Initialize SDK without calling Init Pubnub. Disable to use InitPubnubWithConfig().
  - Set Secret Key Automatically (bool): Only in Project Settings. Automatically sets Secret Key on init.

Must disable automatic initialization:
- You can only use InitPubnubWithConfig() if Initialize Automatically is disabled.

```
`1PubnubSubsystem->InitPubnubWithConfig(FPubnubConfig);  
`
```

FPubnubConfig (configuration struct):
- PublishKey (FString, default "demo"): Publish Key from Admin Portal (required if publishing).
- SubscribeKey (FString, default "demo"): Subscribe Key from Admin Portal.
- SecretKey (FString, default ""): Secret Key from Admin Portal; required for access control. When set, grants root permissions for Access Manager. To use, set SetSecretKeyAutomatically = true or call SetSecretKey().
- UserID (FString, default ""): Required for all operations. If empty, call SetUserID before first operation. UTF-8 string up to 92 alphanumeric characters.
- SetSecretKeyAutomatically (bool, default false): If true, SecretKey is set during initialization (grants root permissions for Access Manager).

### Sample code

Add PubNub dependency in C++ (Source/YourProject/YourProject.Build.cs):

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Initialize/access subsystem in C++:

```
#include "Kismet/GameplayStatics.h"  
#include "PubnubSubsystem.h"  

  
UGameInstance* GameInstance = UGameplayStatics::GetGameInstance(this);  
UPubnubSubsystem* PubnubSubsystem = GameInstance->GetSubsystemUPubnubSubsystem>();  

```

Example usage:

```
`PubnubSubsystem->SubscribeToChannel("MyChannel");  
`
```

Blueprints:
- Use the Pubnub Subsystem node. The SDK is managed by a subsystem.

## Usage in Blueprints and C++

##### Required User ID
Always set and persist a User ID to uniquely identify the user/device. It must remain unchanged for the lifetime of the user/device. Without a User ID, you cannot connect to PubNub.

## Encryption

CryptoModule provides message encryption/decryption. Default is disabled.
- Implementations:
  - UPubnubAesCryptor (AES-256-CBC) — recommended.
  - UPubnubLegacyCryptor — legacy compatibility.

To use encryption, configure CryptoModule; then publish operations encrypt automatically and received messages decrypt automatically. For details, see Encryption documentation.