# Unreal API & SDK Docs v0.3.3 – Overview (Condensed)

This overview shows how to integrate PubNub into an Unreal Engine ≥5.2 C++ project, initialize the SDK, and publish/subscribe to a “Hello, World” channel.

---

## Prerequisites
• Unreal Engine 5.2+  
• C++ familiarity  
• PubNub account and keyset (separate keys for prod/test recommended)

---

## Installation

1. Download the **PubNub SDK** plugin from FAB.  
2. Enable **PubNubSDK** in your project.  
3. Add the module dependency (C++ only):

```csharp
PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });
```

4. Include the SDK header in any file that uses PubNub:

```c++
#include "PubnubSubsystem.h"
```

---

## Editor Configuration (Project Settings → Plugins → Pubnub SDK)
Option | Value | Notes
---|---|---
Publish Key | `demo` | Replace with your key
Subscribe Key | `demo` | Replace with your key
Secret Key | *(empty)* | Needed only for Access Manager
Initialize Automatically | ✓ | Recommended
Set Secret Key Automatically | ☐ | Enable only for Access Manager

• If **Initialize Automatically** is off, call `Init()` manually before any PubNub use.  
• Always set a unique, persistent **User ID** for each device/user.

---

## Minimal Project Setup

Create two C++ classes and set them as default in Project Settings:  
• `PubNubGameInstance` (inherits `UGameInstance`)  
• `PubNubPlayerController` (inherits `APlayerController`)

---

## Code

### PubNubGameInstance.h

```c++
// PubNubGameInstance.h
#pragma once

#include "CoreMinimal.h"
#include "Engine/GameInstance.h"
#include "PubnubSubsystem.h"
#include "PubNubGameInstance.generated.h"

UCLASS()
//Replace YOUR_PROJECT_API with [Project_Name]_API
class YOUR_PROJECT_API UPubNubGameInstance : public UGameInstance
{
    GENERATED_BODY()
    
public:
```
*show all 32 lines*

### PubNubGameInstance.cpp

```c++
// PubNubGameInstance.cpp
#include "PubNubGameInstance.h"

void UPubNubGameInstance::Init()
{
    Super::Init();
    
    // Set the channel we'll use for our Hello World example
    ChannelName = "hello_world_channel";
    
    // Get the PubNub subsystem
    PubnubSubsystem = GetSubsystem<UPubnubSubsystem>();
    
    // Set User ID - required for connection
    PubnubSubsystem->SetUserID("unreal_user_123");
```
*show all 51 lines*

---

### PubNubPlayerController.h

```c++
// PubNubPlayerController.h
#pragma once

#include "CoreMinimal.h"
#include "GameFramework/PlayerController.h"
#include "PubNubGameInstance.h"
#include "PubNubPlayerController.generated.h"

UCLASS()
//Replace YOUR_PROJECT_API with [Project_Name]_API
class YOUR_PROJECT_API APubNubPlayerController : public APlayerController
{
    GENERATED_BODY()
    
protected:
```
*show all 23 lines*

### PubNubPlayerController.cpp

```c++
// PubNubPlayerController.cpp
#include "PubNubPlayerController.h"
#include "Kismet/GameplayStatics.h"

void APubNubPlayerController::SetupInputComponent()
{
    Super::SetupInputComponent();
    
    // Bind the P key to publish a Hello World message
    InputComponent->BindKey(EKeys::P, IE_Pressed, this, &APubNubPlayerController::HandleKeyP);
    
    // Get our game instance
    PubNubInstance = Cast<UPubNubGameInstance>(UGameplayStatics::GetGameInstance(GetWorld()));
}
```
*show all 22 lines*

---

## Core Workflow

1. `UPubNubGameInstance::Init()`  
   • Set channel, user ID.  
   • Register message & error listeners.  
   • Call `Subscribe({ChannelName});`

2. `APubNubPlayerController::HandleKeyP()`  
   • Publish `{ "text": "Hello, World!" }` to `ChannelName`.

---

## Reference Links

• Configuration → /docs/sdks/unreal/api-reference/configuration  
• Publish / Subscribe → /docs/sdks/unreal/api-reference/publish-and-subscribe  
• Event Listeners → /docs/sdks/unreal/api-reference/configuration#event-listeners  
• Presence, Storage, Access Manager, Objects → see respective API reference sections.

_Last updated: Apr 24 2025_