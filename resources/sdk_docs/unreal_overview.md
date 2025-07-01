# Unreal API & SDK Docs v0.3.3 – Overview (Condensed)

## Prerequisites
* Unreal Engine 5.2 or higher and C++ basics  
* PubNub account (publish & subscribe keys)

## Install the SDK
1. Get keys in the PubNub Admin Portal.  
2. Install and enable the **PubNub SDK** plugin from FAB.  
3. Add the build dependency:  
   ```cpp
   `PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
   `
   ```  
4. Include the header where PubNub is used:  
   ```cpp
   `#include "PubnubSubsystem.h"  
   `
   ```

## Editor Configuration  (Settings → Project Settings → Plugins → Pubnub SDK)
| Option                     | Example | Note                              |
|----------------------------|---------|-----------------------------------|
| Publish Key                | demo    | Replace with your key             |
| Subscribe Key              | demo    | Replace with your key             |
| Secret Key                 | —       | Needed only for access control    |
| Initialize Automatically   | ✔       | Recommended                       |
| Set Secret Key Automatically | ☐     | Only if using access control      |
Always set a unique User ID in code before connecting.

## Project Setup
1. Add C++ classes  
   • `PubNubGameInstance` (UGameInstance)  
   • `PubNubPlayerController` (APlayerController)  
2. Project Settings → Maps & Modes  
   • Default GameInstance: `PubNubGameInstance`  
   • Default Player Controller: `PubNubPlayerController`

## Core Code

### GameInstance – initialization & subscribe
```cpp
`// PubNubGameInstance.h  
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
`
```

```cpp
`// PubNubGameInstance.cpp  
#include "PubNubGameInstance.h"  
  
void UPubNubGameInstance::Init()  
{  
	Super::Init();  
      
	// Set the channel we'll use for our Hello World example  
	ChannelName = "hello_world_channel";  
      
	// Get the PubNub subsystem  
	PubnubSubsystem = GetSubsystemUPubnubSubsystem>();  
      
	// Set User ID - required for connection  
	PubnubSubsystem->SetUserID("unreal_user_123");  
`
```

### PlayerController – publish on key press
```cpp
`// PubNubPlayerController.h  
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
`
```

```cpp
`// PubNubPlayerController.cpp  
#include "PubNubPlayerController.h"  
#include "Kismet/GameplayStatics.h"  
  
void APubNubPlayerController::SetupInputComponent()  
{  
	Super::SetupInputComponent();  
      
	// Bind the P key to publish a Hello World message  
	InputComponent->BindKey(EKeys::P, IE_Pressed, this, &APubNubPlayerController::HandleKeyP);  
      
	// Get our game instance  
	PubNubInstance = CastUPubNubGameInstance>(UGameplayStatics::GetGameInstance(GetWorld()));  
}  
  
`
```

## Run
* Play In Editor, press **P** → “Hello, World!” publishes to `hello_world_channel`.  
* Open a second client to confirm real-time delivery.

## Next Steps
Presence, Storage, Access Manager, Objects, Unreal Chat SDK, GitHub samples, full API docs, Discord, and Support.

_Last updated: Apr 24 2025_