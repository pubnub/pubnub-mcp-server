# Unreal API & SDK Docs 1.2.0

Build a minimal “Hello, World” app in Unreal Engine using PubNub:
- Connect to PubNub
- Publish “Hello, World”
- Receive messages in real time

## Overview

Initialize the SDK, set event listeners, and send/receive a “Hello, World” message in Unreal Engine (C++).

## Prerequisites

- Unreal Engine 5.2+ (5.0.x–5.1.x supported via manual plugin install)
- Basic Unreal Engine and C++ knowledge
- PubNub account and keyset

For Unreal Engine 5.0.x–5.1.x, install the plugin manually:
- Install Unreal Engine 5.0.x or 5.1.x.
- Create a new blank Unreal project.
- Create an empty Plugins folder in your project.

#### Download the SDK

In the Plugins folder of your Unreal project:
- Clone the SDK: https://github.com/pubnub/unreal-engine
- Rename the cloned folder to Pubnub

#### Configure the workspace

Generate project files:
- macOS: Services -> Generate xCode project
- Windows: Generate Visual Studio project files

Open your IDE, then add the dependency to PubnubLibrary in Source/YourProject/YourProject.Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Compile and run.

## Setup

### Get your PubNub keys

- Sign in or create an account: https://admin.pubnub.com
- Create an app; first keyset is generated automatically
- Get publish and subscribe keys from the dashboard
- Use separate keysets for production and test environments

### Install the SDK

- Use the latest SDK version.
- Install the PubNub SDK plugin from FAB (https://www.fab.com/listings/9501a8d6-f9e6-4cf8-8b56-d173bdb71fc4) or from GitHub (https://github.com/pubnub/unreal-engine).
- Enable the PubNubSDK plugin in your project.

Add the C++ module dependency in Build.cs:

```
`PrivateDependencyModuleNames.AddRange(new string[] { "PubnubLibrary" });  
`
```

Include the header in files using the SDK:

```
`#include "PubnubSubsystem.h"  
`
```

### Configure PubNub in Unreal Editor

Project Settings -> Plugins -> Pubnub SDK:
- Publish Key: demo (replace with your key)
- Subscribe Key: demo (replace with your key)
- Secret Key: leave empty (only for access control)
- Initialize Automatically: checked (recommended)
- Set Secret Key Automatically: unchecked (only if using access control)

SDK initialization
- If Initialize Automatically is off, initialize PubNub in code before use.

Required User ID
- Always set a stable User ID for the lifetime of the user/device. Without it, you cannot connect.

### Configure the Unreal Engine project

Create two C++ classes:
- PubNubGameInstance (inherits UGameInstance)
- PubNubPlayerController (inherits APlayerController)

Project settings:
- Set Default GameInstance to PubNubGameInstance
- Set Default Player Controller to PubNubPlayerController

## Steps

### Initialize PubNub

In your header file (PubNubGameInstance.h):

```
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
	virtual void Init() override;  
      
	// Message listener  
	UFUNCTION()  
	void OnMessageReceived(FPubnubMessageData MessageData);  
      
	// Error handler  
	UFUNCTION()  
	void OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType);  
      
	// Function to publish our Hello World message  
	void PublishHelloWorld();  
      
private:  
	UPubnubSubsystem* PubnubSubsystem = nullptr;  
	FString ChannelName;  
};  

```

In your implementation file (PubNubGameInstance.cpp):

```
// PubNubGameInstance.cpp  
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
      
	// Bind message and error handlers  
	PubnubSubsystem->OnMessageReceived.AddDynamic(this, &UPubNubGameInstance::OnMessageReceived);  
	PubnubSubsystem->OnPubnubError.AddDynamic(this, &UPubNubGameInstance::OnErrorReceived);  
      
	// Subscribe to our channel  
	PubnubSubsystem->SubscribeToChannel(ChannelName);  
      
	UE_LOG(LogTemp, Log, TEXT("PubNub initialized and subscribed to channel: %s"), *ChannelName);  
	UE_LOG(LogTemp, Log, TEXT("Press P key to publish a Hello World message"));  
	  
}  

  
void UPubNubGameInstance::OnMessageReceived(FPubnubMessageData MessageData)  
{  
	// When a message is received, log it to the console  
	UE_LOG(LogTemp, Log, TEXT("Message received on channel: %s"), *MessageData.Channel);  
	UE_LOG(LogTemp, Log, TEXT("Message content: %s"), *MessageData.Message);  
}  

  
void UPubNubGameInstance::OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType)  
{  
	// Log any errors  
	UE_LOG(LogTemp, Error, TEXT("PubNub error: %s"), *ErrorMessage);  
}  

  
void UPubNubGameInstance::PublishHelloWorld()  
{  
	// Our simple Hello World message (with quotes as it has to be a valid Json)  
	FString Message = "\"Hello, World!\"";  
      
	UE_LOG(LogTemp, Log, TEXT("Publishing message: %s"), *Message);  
      
	// Publish to our channel  
	PubnubSubsystem->PublishMessage(ChannelName, Message);  
}  

```

### Set up event listeners

- Message and error listeners are bound in GameInstance::Init.
- They log received messages and errors.

### Create a subscription

- Subscribes to "hello_world_channel" in GameInstance::Init.

### Publish messages

- Messages must be JSON-serializable and < 32 KiB.
- Use a PlayerController to publish on P key press.

In your header file (PubNubPlayerController.h):

```
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
	virtual void SetupInputComponent() override;  
      
	// Handler for the P key press  
	void HandleKeyP();  
      
	// Reference to our game instance  
	UPubNubGameInstance* PubNubInstance = nullptr;  
};  

```

In your implementation file (PubNubPlayerController.cpp):

```
// PubNubPlayerController.cpp  
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

  
void APubNubPlayerController::HandleKeyP()  
{  
	if (PubNubInstance)  
	{  
		PubNubInstance->PublishHelloWorld();  
	}  
}  

```

### Run the app

- Launch the project, play in editor, press P to publish, and observe the Output Log.

#### Cross-platform testing

- Test on multiple platforms to verify real-time behavior.

## Complete example

- PubNubGameInstance.h

```
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
	virtual void Init() override;  
      
	// Message listener  
	UFUNCTION()  
	void OnMessageReceived(FPubnubMessageData MessageData);  
      
	// Error handler  
	UFUNCTION()  
	void OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType);  
      
	// Function to publish our Hello World message  
	void PublishHelloWorld();  
      
private:  
	UPubnubSubsystem* PubnubSubsystem = nullptr;  
	FString ChannelName;  
};  

```

- PubNubGameInstance.cpp

```
// PubNubGameInstance.cpp  
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
      
	// Bind message and error handlers  
	PubnubSubsystem->OnMessageReceived.AddDynamic(this, &UPubNubGameInstance::OnMessageReceived);  
	PubnubSubsystem->OnPubnubError.AddDynamic(this, &UPubNubGameInstance::OnErrorReceived);  
      
	// Subscribe to our channel  
	PubnubSubsystem->SubscribeToChannel(ChannelName);  
      
	UE_LOG(LogTemp, Log, TEXT("PubNub initialized and subscribed to channel: %s"), *ChannelName);  
	UE_LOG(LogTemp, Log, TEXT("Press P key to publish a Hello World message"));  
	  
}  

  
void UPubNubGameInstance::OnMessageReceived(FPubnubMessageData MessageData)  
{  
	// When a message is received, log it to the console  
	UE_LOG(LogTemp, Log, TEXT("Message received on channel: %s"), *MessageData.Channel);  
	UE_LOG(LogTemp, Log, TEXT("Message content: %s"), *MessageData.Message);  
}  

  
void UPubNubGameInstance::OnErrorReceived(FString ErrorMessage, EPubnubErrorType ErrorType)  
{  
	// Log any errors  
	UE_LOG(LogTemp, Error, TEXT("PubNub error: %s"), *ErrorMessage);  
}  

  
void UPubNubGameInstance::PublishHelloWorld()  
{  
	// Our simple Hello World message (with quotes as it has to be a valid Json)  
	FString Message = "\"Hello, World!\"";  
      
	UE_LOG(LogTemp, Log, TEXT("Publishing message: %s"), *Message);  
      
	// Publish to our channel  
	PubnubSubsystem->PublishMessage(ChannelName, Message);  
}  

```

- PubNubPlayerController.h

```
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
	virtual void SetupInputComponent() override;  
      
	// Handler for the P key press  
	void HandleKeyP();  
      
	// Reference to our game instance  
	UPubNubGameInstance* PubNubInstance = nullptr;  
};  

```

- PubNubPlayerController.cpp

```
// PubNubPlayerController.cpp  
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

  
void APubNubPlayerController::HandleKeyP()  
{  
	if (PubNubInstance)  
	{  
		PubNubInstance->PublishHelloWorld();  
	}  
}  

```

## Next steps

- Unreal Chat SDK: /docs/chat/unreal-chat-sdk
- Presence: /docs/sdks/unreal/api-reference/presence
- Message Persistence: /docs/sdks/unreal/api-reference/storage-and-playback
- Access Manager: /docs/sdks/unreal/api-reference/access-manager
- Objects: /docs/sdks/unreal/api-reference/objects
- Blog announcement: https://www.pubnub.com/blog/announcing-pubnubs-unreal-engine-and-gaming-chat-sdks/
- GitHub samples: https://github.com/pubnub/unreal-engine/
- SDK reference: /docs/sdks/unreal/api-reference/configuration
- Support: https://support.pubnub.com/